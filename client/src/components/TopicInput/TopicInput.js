import React, { useState } from 'react';

const searchRangeOptions = [
 { id: 'all', label: '전체' },
 { id: 'academic', label: '학술자료' },
 { id: 'government', label: '정부/공공기관' },
 { id: 'news', label: '뉴스' }
];

const TopicInput = ({ onSubmit }) => {
 const [topic, setTopic] = useState('');
 const [searchRange, setSearchRange] = useState('all');
 const [keywords, setKeywords] = useState([]);
 const [requiredContent, setRequiredContent] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState('');
 const [newKeyword, setNewKeyword] = useState('');
 const [images, setImages] = useState([]);

 const handleImageUpload = (e) => {
   const files = Array.from(e.target.files);
   setImages(files);
 };

 const handleKeywordAdd = (e) => {
   e.preventDefault();
   if (newKeyword.trim()) {
     setKeywords([...keywords, newKeyword.trim()]);
     setNewKeyword('');
   }
 };

 const handleKeywordRemove = (indexToRemove) => {
   setKeywords(keywords.filter((_, index) => index !== indexToRemove));
 };

 const handleImageRemove = (indexToRemove) => {
   setImages(images.filter((_, index) => index !== indexToRemove));
 };

 const handleSubmit = async (e) => {
   e.preventDefault();
   if (!topic.trim()) {
     setError('주제를 입력해주세요');
     return;
   }

   setError('');
   setIsLoading(true);
   
   try {
     await onSubmit({
       topic: topic.trim(),
       searchRange,
       keywords,
       requiredContent,
       images
     });
   } catch (err) {
     setError(err.message || '처리 중 오류가 발생했습니다');
   } finally {
     setIsLoading(false);
   }
 };

 return (
   <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
     <h2 className="text-2xl font-bold mb-6 text-gray-800">주제 입력</h2>
     <form onSubmit={handleSubmit} className="space-y-6">
       <div>
         <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
           연구할 주제
         </label>
         <input
           type="text"
           id="topic"
           value={topic}
           onChange={(e) => setTopic(e.target.value)}
           placeholder="연구하고 싶은 주제를 입력해주세요"
           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           disabled={isLoading}
         />
       </div>

       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
           참고 이미지
         </label>
         <div className="flex flex-col space-y-2">
           <input
             type="file"
             multiple
             accept="image/*"
             onChange={handleImageUpload}
             className="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-md file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100"
             disabled={isLoading}
           />
           {images.length > 0 && (
             <div className="flex flex-wrap gap-2 mt-2">
               {images.map((image, index) => (
                 <div key={index} className="relative">
                   <div className="group relative">
                     <img
                       src={URL.createObjectURL(image)}
                       alt={`업로드된 이미지 ${index + 1}`}
                       className="h-20 w-20 object-cover rounded-md"
                     />
                     <button
                       type="button"
                       onClick={() => handleImageRemove(index)}
                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                     >
                       ×
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           )}
         </div>
       </div>

       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
           필수 키워드
         </label>
         <div className="flex space-x-2 mb-2">
           <input
             type="text"
             value={newKeyword}
             onChange={(e) => setNewKeyword(e.target.value)}
             placeholder="키워드를 입력하세요"
             className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             disabled={isLoading}
           />
           <button
             onClick={handleKeywordAdd}
             type="button"
             className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
             disabled={isLoading}
           >
             추가
           </button>
         </div>
         {keywords.length > 0 && (
           <div className="flex flex-wrap gap-2 mt-2">
             {keywords.map((keyword, index) => (
               <span
                 key={index}
                 className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
               >
                 {keyword}
                 <button
                   type="button"
                   onClick={() => handleKeywordRemove(index)}
                   className="ml-2 text-blue-600 hover:text-blue-800"
                 >
                   ×
                 </button>
               </span>
             ))}
           </div>
         )}
       </div>

       <div>
         <label htmlFor="requiredContent" className="block text-sm font-medium text-gray-700 mb-2">
           필수 포함 내용
         </label>
         <textarea
           id="requiredContent"
           value={requiredContent}
           onChange={(e) => setRequiredContent(e.target.value)}
           placeholder="글에 반드시 포함되어야 할 내용을 입력하세요"
           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
           disabled={isLoading}
         />
       </div>

       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
           검색 범위
         </label>
         <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
           {searchRangeOptions.map((option) => (
             <label
               key={option.id}
               className="flex items-center space-x-2 cursor-pointer"
             >
               <input
                 type="radio"
                 name="searchRange"
                 value={option.id}
                 checked={searchRange === option.id}
                 onChange={(e) => setSearchRange(e.target.value)}
                 className="text-blue-500 focus:ring-blue-500"
                 disabled={isLoading}
               />
               <span className="text-sm text-gray-700">{option.label}</span>
             </label>
           ))}
         </div>
       </div>

       {error && (
         <div className="text-red-500 text-sm">
           {error}
         </div>
       )}

       <button
         type="submit"
         disabled={isLoading}
         className={`w-full py-2 px-4 rounded-md text-white font-medium 
           ${isLoading 
             ? 'bg-gray-400 cursor-not-allowed' 
             : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
           }`}
       >
         {isLoading ? '처리 중...' : '분석 시작'}
       </button>
     </form>
   </div>
 );
};

export default TopicInput;