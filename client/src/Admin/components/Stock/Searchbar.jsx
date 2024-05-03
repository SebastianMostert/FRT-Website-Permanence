/* eslint-disable react/prop-types */
import { Form, FormControl, InputGroup } from 'react-bootstrap';

const Searchbar = ({ searchTerm, setSearchTerm, searchType, searchWhat }) => {

    return (
        <Form className="mb-3">
            <InputGroup className="mb-3">
                <FormControl
                    type="text"
                    placeholder={`Search ${searchWhat} by ${searchType}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>
        </Form>
    );
}

export default Searchbar