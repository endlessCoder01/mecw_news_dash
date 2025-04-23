// PostNews.js
import { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PostNews = ({ categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    author_id: '',
    image: null
  });
  const [preview, setPreview] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category_id', formData.category_id);
    data.append('author_id', formData.author_id);
    data.append('image', formData.image);

    try {
      const res = await axios.post('http://localhost:5000/mecw/api/articles', data);
      alert('Article posted successfully!');
      setFormData({
        title: '',
        content: '',
        category_id: '',
        author_id: '',
        image: null
      });
      setPreview('');
    } catch (error) {
      alert('Error posting article: ' + error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="card shadow">
      <div className="card-body">
        <h2 className="mb-4">Create New Article</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Content</label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              className="mb-4"
              style={{ height: '270px' }}
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6"  style={{marginTop: 25}}>
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label"  style={{marginTop: 25}}>Author ID</label>
              <input
                type="number"
                className="form-control"
                value={formData.author_id}
                onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Featured Image</label>
            <input
              type="file"
              className="form-control"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            {preview && (
              <div className="mt-3">
                <img src={preview} alt="Preview" className="img-thumbnail" style={{ maxHeight: '200px' }} />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary">Publish Article</button>
        </form>
      </div>
    </div>
  );
};

export default PostNews;