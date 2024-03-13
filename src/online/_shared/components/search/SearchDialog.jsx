// SearchDialog.jsx

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useLazyQuery } from '@apollo/client';
import SearchResultList from './SearchResultList';
import { GET_SEARCH } from '../../../../_shared/graphql/queries/SearchQueries';
import SearchFilter from './SearchFilter';

const SearchDialog = ({ open, onClose }) => {
    const [paginator, setPaginator] = React.useState({ page: 1, limit: 4 });
    const [searchFilter, setSearchFilter] = React.useState(null);
    const handleFilterChange = (newFilter) => {
      console.log('newFilter', newFilter)
      setSearchFilter(newFilter);
    };

    const [getSearchResults, { 
        loading: loadingSearchResults, 
        data: searchResultsData, 
        error: searchResultsError, 
        fetchMore:  fetchMoreSearchResults 
      }] = useLazyQuery(GET_SEARCH, { variables: { searchFilter, page: paginator.page, limit: paginator.limit }})

    React.useEffect(() =>{
        getSearchResults()
    }, [searchFilter, paginator])

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogContent>
                <SearchFilter onFilterChange={handleFilterChange} />
                {searchFilter?.keyword !== '' && <SearchResultList results={searchResultsData?.search?.results} 
                                                                    loading={loadingSearchResults} 
                                                                    keyword={searchFilter?.keyword}
                                                                    />}
            </DialogContent>
        </Dialog>
    );
};

export default SearchDialog;
