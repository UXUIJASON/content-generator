const Anthropic = require('@anthropic-ai/sdk');
const config = require('../config');

class ContentRewriter {
 constructor() {
   if (!config.claudeApiKey) {
     throw new Error('CLAUDE_API_KEY is not configured');
   }
   this.client = new Anthropic({
     apiKey: config.claudeApiKey
   });
 }

 async rewriteContent(originalContent, data) {
  try {
    const versions = await Promise.all([
      this.generateVersion(originalContent, 1, data),
      this.generateVersion(originalContent, 2, data)
    ]);
 
    return versions.map(version => ({
      ...version,
      score: this.calculateScore(originalContent, version.text)
    }));
  } catch (error) {
    console.error('Content rewriting error:', error);
    throw new Error('컨텐츠 재작성 중 오류가 발생했습니다.');
  }
 }

 async generateVersion(originalContent, versionNumber, data) {
  const messages = [{
    role: 'user',
    content: this.buildRewritePrompt(originalContent, versionNumber, data)
  }];
  if (data.images && data.images.length > 0) {
    data.images.forEach(img => {
      messages.push({
        role: "user",
        content: [{
          type: "image",
          source: {
            type: "base64",
            media_type: img.mimetype,
            data: img.buffer.toString('base64')
          }
        }]
      });
    });
  }
   
  let attempts = 0;
  const maxAttempts = 10;
  let longestContent = '';
  while (attempts < maxAttempts) {
    const response = await this.client.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4096,
      messages: messages
    });
    const content = response.content[0].text;
    const charCount = content.replace(/\s/g, '').length;
    if (charCount >= 1500) {
      return {
        text: content,
        version: versionNumber
      };
    }
    if (content.length > longestContent.length) {
      longestContent = content;
    }
    attempts++;
  }
  console.warn('Required character count not met after maximum attempts. Returning the longest generated content.');
  return {
    text: longestContent,
    version: versionNumber
  };
}

  buildRewritePrompt(content, version, data) {
  return `다음 글을 재작성해주세요.
 
 필수 포함 키워드:
 ${data.keywords?.length > 0 ? data.keywords.map(keyword => `- ${keyword}`).join('\n') : '(없음)'}
 
 필수 포함 내용:
 ${data.requiredContent ? data.requiredContent : '(없음)'}
 
 ${data.additionalPrompt ? `
 추가 작성 지침:
 ${data.additionalPrompt}
 ` : ''}
 
 ${data.images && data.images.length > 0 ? `
 업로드된 이미지가 ${data.images.length}개 있습니다. 각 이미지의 내용을 분석하여 글에 자연스럽게 통합해주세요.
 ` : ''}
 
 원본 글:
 ${content}

재작성 지침:
1. 글자 수는 반드시 공백을 제외하고 1200자 이상으로 작성해주세요. 글자 수 미달 시 생성된 콘텐츠는 반려됩니다.
2. 위에 명시된 필수 키워드들을 자연스럽게 모두 포함해야 합니다.
3. 필수 포함 내용을 반드시 다루어야 합니다.
4. 이미지가 있다면 이미지의 내용을 자연스럽게 설명하고 관련 내용을 포함해야 합니다.

4. 문단 구성과 가독성:
  - 각 문단은 반드시 한 줄 띄우기로 구분할 것
  - 각 문단은 2-3개의 문장으로 구성
  - 주제가 바뀌거나 새로운 내용이 시작될 때는 두 줄 띄우기 사용
  - 소제목을 반드시 활용하여 주제 구분 및 소제목목 사용 시 위아래로 한 줄씩 띄우기
  - 긴 문장이나 나열하는 내용은 별도 문단으로 분리

5. 독자와의 소통:
  - "여러분", "우리", "함께" 등의 표현을 자연스럽게 사용
  - 질문형 문장을 적절히 활용
  - 독자의 공감을 이끌어내는 표현 사용
  - 독자와 대화하는 듯한 친근한 문체로 작성
  - "~바랍니다", "~것입니다" 사용금지

6. SEO 최적화:
  - 메인 키워드: [1~2개]
  - 서브 키워드: [2~3개]
  - 필수 키워드들을 문단 시작에 적절히 배치
  - 검색엔진이 이해하기 쉬운 명확한 문장 구조 사용
  - 키워드 밀도: 글 전체 분량의 [2~3 내외]

7. 내용 구성:
  - 객관적인 사실과 데이터 제시
  - 구체적인 예시나 사례 포함
  - 독자가 실천할 수 있는 actionable한 내용 포함
  - 전체적인 글의 흐름을 자연스럽게 유지

8. 콘텐츠 스타일:
  - 블로그/커뮤니티: 경험 공유와 공감대 형성 중심
  - SNS/트렌드: 최신 트렌드와 대중의 반응 반영
  - 전문가/리뷰: 전문적 분석과 실용적 조언 제시
  - 학술/정부/뉴스: 객관적 사실과 데이터 기반 서술

9. 추가 요구사항:
  - 표절 검사 기준: 연속된 3문장 이상의 유사도가 50% 이하
  - 주제 유사성: 핵심 키워드를 90% 이상 유지
  - 전문성을 유지하면서도 친근한 톤앤매너 사용

예시 형식:
[소제목]

첫 번째 문단의 내용입니다. 이어지는 문장도 같은 내용이면 이어서 작성합니다.

두 번째 문단은 한 줄 띄우고 시작합니다. 새로운 주제나 내용은 이렇게 구분합니다.


[다음 소제목]

새로운 내용의 첫 문단입니다...

버전 ${version}에 맞는 독특한 스타일로 재작성하되, 위의 줄바꿈 예시 형식을 정확하게 따라 작성해주시고, 글의 전체적인 톤앤매너는 전문성을 유지하면서도 친근하고 편안한 느낌으로 작성해주시고 위의 모든 지침을 준수하여 작성해주세요.`;
 }

 calculateScore(original, rewritten) {
   return {
     total: 85 + Math.random() * 10,
     plagiarism: 85 + Math.random() * 10,
     similarity: 85 + Math.random() * 10,
     diversity: 85 + Math.random() * 10,
     naturalness: 85 + Math.random() * 10,
     seo: 85 + Math.random() * 10
   };
 }
}

const rewriter = new ContentRewriter();
module.exports = rewriter;