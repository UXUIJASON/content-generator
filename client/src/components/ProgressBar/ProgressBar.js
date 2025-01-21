import React from 'react';

const ProgressBar = ({ progress, stage }) => {
  const stages = {
    collecting: '자료 수집',
    analyzing: '내용 분석',
    rewriting: '컨텐츠 재가공',
    complete: '완료'
  };

  const getStageMessage = () => {
    switch (stage) {
      case 'collecting':
        return '관련 자료를 수집하고 있습니다...';
      case 'analyzing':
        return '수집된 자료를 분석하고 있습니다...';
      case 'rewriting':
        return '컨텐츠를 재가공하고 있습니다...';
      case 'complete':
        return '모든 처리가 완료되었습니다!';
      default:
        return '처리 중입니다...';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* 진행 단계 표시 */}
      <div className="flex justify-between mb-4">
        {Object.entries(stages).map(([key, label], index) => (
          <div
            key={key}
            className={`flex flex-col items-center ${
              Object.keys(stages).indexOf(stage) >= index
                ? 'text-blue-600'
                : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                Object.keys(stages).indexOf(stage) >= index
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>

      {/* 진행 바 */}
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 진행 상태 메시지 */}
      <div className="mt-4 text-center text-sm text-gray-600">
        {getStageMessage()}
      </div>
      
      {/* 진행률 표시 */}
      <div className="mt-2 text-center text-sm font-medium text-blue-600">
        {progress}% 완료
      </div>
    </div>
  );
};

export default ProgressBar;