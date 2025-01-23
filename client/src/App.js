// [수정] useEffect 추가를 위해 import문 수정
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopicInput from './components/TopicInput/TopicInput';
import ProgressBar from './components/ProgressBar/ProgressBar';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // [추가] 환경변수 확인을 위한 useEffect
  useEffect(() => {
    console.log('==== 환경변수 확인 ====');
    console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);
  }, []);

  const handleTopicSubmit = async (topicData) => {
    try {
      // API URL 확인용 로그 추가
      console.log('API URL:', process.env.REACT_APP_API_URL);
      
      setError(null);
      setIsProcessing(true);
      setProgress(0);
      setCurrentStage('collecting');

      // [수정] axios 설정 변경
      const response = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/analyze`,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        data: {
          topic: topicData.topic,
          searchRange: topicData.searchRange,
          keywords: topicData.keywords,
          requiredContent: topicData.requiredContent
        }
      });
      
      // 단계별 진행
      setProgress(30);
      setCurrentStage('analyzing');
      
      setProgress(60);
      setCurrentStage('rewriting');
      
      setProgress(90);

      // 결과 설정
      setResult(response.data);

      setCurrentStage('complete');
      setProgress(100);

    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || '처리 중 오류가 발생했습니다');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AI 콘텐츠 생성기
          </h1>
          <p className="text-gray-600 mt-2">
            주제를 입력하면 관련 자료를 수집하고 최적화된 콘텐츠를 생성합니다
          </p>
        </header>

        <TopicInput onSubmit={handleTopicSubmit} />

        {error && (
          <div className="max-w-2xl mx-auto mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {isProcessing && (
          <div className="mt-8">
            <ProgressBar progress={progress} stage={currentStage} />
          </div>
        )}

        {result && !isProcessing && (
          <div className="mt-8">
            <Dashboard
              originalContent={result.originalContent}
              rewrittenContents={result.rewrittenContents}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;