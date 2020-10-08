import styled from 'styled-components';
import search from 'components/search/Search';

export const GroupMembers = styled.div<{isSearching}>`
    background-color: ${({theme}) => theme.dark.primary};
    margin: 0 auto;
    border-radius: 10px;
    width: 90%;
    min-height: 300px;
    max-width: 500px;
    max-height: ${({isSearching}) => isSearching ? '300px' : undefined};
    padding: 20px;
    box-sizing: border-box;
    overflow: auto;
`;

export const Cross = styled.img`
    margin: 0 15px;
    height: 20px;
`;

export const AddPplCont = styled.div`
    display: flex;
    align-items: center;
    margin: 20px 0;

    &:hover {
        cursor: pointer;
    }
`;

export const Search = styled(search)`
    display: block;
    width: 90%;
    margin: 20px auto;
`;