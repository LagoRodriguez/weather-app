import React from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import styles from './LocationSearch.module.css';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';


const LocationSearch = ({ location, setLocation, onSubmit, loading }) => {

    LocationSearch.propTypes = {
        location: PropTypes.string.isRequired,
        setLocation: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
    };

    const { t } = useTranslation();

    return (
        <form onSubmit={onSubmit} className={styles.formContainer}>
            <TextField
                id="location"
                label={t('location.label')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                fullWidth
                className={styles.textField}
                />
            <Button
                type="submit"
                variant="outlined"
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} /> : null}
                className={styles.searchButton}
            >
                {t('search_button')}
            </Button>
        </form>
    );
};

export default LocationSearch;
