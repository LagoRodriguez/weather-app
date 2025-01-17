import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import styles from './FavoritesList.module.css';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const FavoritesList = ({ favorites, onSelectLocation }) => {

    FavoritesList.propTypes = {
        favorites: PropTypes.array.isRequired,
        onSelectLocation: PropTypes.func.isRequired,
    };

    const { t } = useTranslation();

    return (
        <Box className={styles.favoritesContainer}>
            {favorites.length > 0 ? (
                <>
                    <Typography className={styles.favoritesTitle}>
                        {t('favorites_title')}
                    </Typography>

                    <List className={styles.favoritesList}>
                        {favorites.map((favLocation, index) => (
                            <ListItem
                                key={index}
                                onClick={() => onSelectLocation(favLocation)}
                                className={styles.selectedCity}
                            >
                                <ListItemText primary={`- ${favLocation.toUpperCase()}`} />
                            </ListItem>
                        ))}
                    </List>
                </>
            ) : null}
        </Box>
    );
};

export default FavoritesList;
