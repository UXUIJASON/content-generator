import React, { useState } from 'react';

const Dashboard = ({ originalContent, rewrittenContents }) => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const ContentCard = ({ content, index }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`text-2xl font-bold ${getScoreColor(content.score.total)}`}>
          {content.score.total.toFixed(1)}점
        </div>
        <div className="space-x-2">
          <button
            onClick={() => {
              setSelectedVersion(content);
              setShowComparison(true);
            }}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            원문 비교
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(content.text)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            복사
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span>표절 점수:</span>
          <span>{content.score.plagiarism.toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span>주제 유사도:</span>
          <span>{content.score.similarity.toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span>표현 다양성:</span>
          <span>{content.score.diversity.toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span>자연스러움:</span>
          <span>{content.score.naturalness.toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span>SEO 점수:</span>
          <span>{content.score.seo.toFixed(1)}</span>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="text-sm text-gray-700 max-h-48 overflow-y-auto">
          {content.text.substring(0, 300)}...
        </div>
      </div>
    </div>
  );

  const ComparisonView = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">원문 비교</h3>
          <button
            onClick={() => setShowComparison(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6 p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 60px)' }}>
          <div>
            <h4 className="font-semibold mb-2">원본</h4>
            <div className="border rounded p-4 text-sm">{originalContent}</div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">재작성본</h4>
            <div className="border rounded p-4 text-sm">{selectedVersion?.text}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">재작성된 콘텐츠</h2>
        <p className="text-gray-600">원본 콘텐츠를 기반으로 5개의 버전이 생성되었습니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewrittenContents.map((content, index) => (
          <ContentCard key={index} content={content} index={index} />
        ))}
      </div>

      {showComparison && <ComparisonView />}
    </div>
  );
};

export default Dashboard;