import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS for the snow theme
import ImageResize from 'quill-image-resize-module-react'; // Import the image resize module

// Add the ImageResize module to ReactQuill
ReactQuill.Quill.register('modules/imageResize', ImageResize);

export default function TextEditorField({ value, onChange, placeholder }) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={TextEditorField.modules}
      formats={TextEditorField.formats}
      placeholder={placeholder || 'Écrivez votre texte ici...'} // French placeholder
      style={{ minHeight: '200px',height: '100%' }} // You can change this value
    />
  );
}

// Quill modules to control which features are available, including the image resize module
TextEditorField.modules = {
  toolbar: [
    [{ font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image', 'video'],
    ['clean'], // Remove formatting button
  ],
  imageResize: {
    // Configuration for the image resize module
    modules: ['Resize', 'DisplaySize', 'Toolbar'],
  },
};

// Quill formats that are allowed
TextEditorField.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
  'image',
  'video',
];
