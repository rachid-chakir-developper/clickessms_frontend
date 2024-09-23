import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS for the snow theme

export default function TextEditorField({ value, onChange, placeholder }) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={TextEditorField.modules}
      formats={TextEditorField.formats}
      placeholder={placeholder || "Écrivez votre texte ici..."}  // French placeholder
      style={{ minHeight: '200px' }}  // You can change this value
    />
  );
}

// Quill modules to control which features are available
TextEditorField.modules = {
  toolbar: [
    [{ 'font': [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image', 'video'],
    ['clean'], // Remove formatting button
  ],
};

// Quill formats that are allowed
TextEditorField.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet',
  'link', 'image', 'video'
];
