import { useContext } from 'react';

import { ConfigurationContext } from '../contexts/ConfigurationContext';

const useConfiguration = () => {
    const context = useContext(ConfigurationContext)
    return context;
}

export default useConfiguration