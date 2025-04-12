
import React from 'react';

const CSVUploadInstructions = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium mb-2">CSV Upload Instructions</h3>
      <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
        <li>Create a CSV file with a header row containing "ISBN" and/or "Title" columns</li>
        <li>Each row should represent one book</li>
        <li>ISBNs should be 10 or 13 digits without dashes</li>
        <li>We'll try to find book details using Google Books API</li>
      </ul>
    </div>
  );
};

export default CSVUploadInstructions;
