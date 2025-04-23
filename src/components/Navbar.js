import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Dropdown, NavDropdown } from 'react-bootstrap';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img 
            src="/logo.png" 
            alt="News Portal" 
            width="30" 
            height="30"
            className="me-2"
          />
          News Portal Dashboard
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="fas fa-home me-1"></i>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/articles">
                <i className="fas fa-newspaper me-1"></i>
                My Articles
              </Link>
            </li>
            <NavDropdown 
              title={
                <>
                  <i className="fas fa-plus-circle me-1"></i>
                  Create
                </>
              } 
              id="create-dropdown"
            >
              <Dropdown.Item as={Link} to="/post">
                New Article
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/drafts">
                Drafts
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/media">
                Media Library
              </Dropdown.Item>
            </NavDropdown>
          </ul>

          {/* Search Form */}
          <form className="d-flex mx-3">
            <input
              type="search"
              className="form-control"
              placeholder="Search articles..."
              aria-label="Search"
            />
            <button className="btn btn-outline-light ms-2">
              <i className="fas fa-search"></i>
            </button>
          </form>

          {/* Right Side */}
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item dropdown">
                  <Dropdown>
                    <Dropdown.Toggle variant="dark" id="profile-dropdown">
                      <img
                        src={user.avatar || '/default-avatar.png'}
                        alt="Profile"
                        width="30"
                        height="30"
                        className="rounded-circle me-2"
                      />
                      {user.username}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropdown-menu-dark">
                      <Dropdown.Item as={Link} to="/profile">
                        <i className="fas fa-user me-2"></i>
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/settings">
                        <i className="fas fa-cog me-2"></i>
                        Settings
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item 
                        onClick={() => {
                          logout();
                          navigate('/login');
                        }}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
                <li className="nav-item">
                  <span className="nav-link text-warning">
                    <i className="fas fa-star me-1"></i>
                    {user.role}
                  </span>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-outline-light" to="/login">
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;