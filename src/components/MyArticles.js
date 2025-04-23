// MyArticles.js
const MyArticles = ({ articles }) => {
    console.log(articles);
    return (
      <div className="card shadow">
        <div className="card-body">
          <h2 className="mb-4">My Published Articles</h2>
          <div className="row">
            {articles.map(article => (
              <div key={article.id} className="col-md-6 mb-4">
                <div className="card h-100">
                  {article.image && (
                    <img 
                      src={`http://localhost:5000/uploads/${article.image}`} 
                      className="card-img-top"
                      alt={article.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{article.title}</h5>
                    <p className="card-text text-muted">{article.category}</p>
                    <div 
                      className="card-text truncate" 
                      dangerouslySetInnerHTML={{ __html: article.content }} 
                    />
                  </div>
                  <div className="card-footer text-muted">
                    Posted on: {new Date(article.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default MyArticles;