import React from 'react';
import { render, screen } from '@testing-library/react';
import BlogList from './BlogList'; // Adjust the import path as needed
import AuthContext from '../../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';


test('renders BlogList component', () => {
  render( <AuthContext.Provider value={{ token: 'test-token' }}>
    <BrowserRouter>
      <BlogList />
    </BrowserRouter>
  </AuthContext.Provider>);
  
  // Check if the BlogList component's title is present
  expect(screen.getByTestId('blog-list-title')).toBeInTheDocument();
  
  // Check if the search bar is present
  expect(screen.getByTestId('blog-search-bar')).toBeInTheDocument();
  
  // Check if the category buttons container is present
  expect(screen.getByTestId('blog-categories-bar')).toBeInTheDocument();
  
});
