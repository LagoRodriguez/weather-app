import React, { useState } from "react";
import { Typography, Box, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import styles from './WeatherDisplay.module.css';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';


const WeatherDisplay = ({ weatherData }) => {

    WeatherDisplay.propTypes = {
        weatherData: PropTypes.shape({
            location: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
            current: PropTypes.shape({
                humidity: PropTypes.number.isRequired,
                wind_kph: PropTypes.number.isRequired,
            }).isRequired,
        }).isRequired,
    };

    const { t } = useTranslation();
    const [unit, setUnit] = useState("C");

    const handleUnitChange = (event) => {
        setUnit(event.target.value);
    };

    if (!weatherData) {
        return null;
    }

    return (
        <Box className={styles.weatherDisplay} display="flex" flexDirection="column">
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {weatherData.location.name}
            </Typography>
                <Divider sx={{ my: 1, width: '100%' }} />
            <Typography>
                {t('humidity')}: {weatherData.current.humidity}%
            </Typography>
            <Typography>
                {t('wind')}: {weatherData.current.wind_kph} kph
            </Typography>
            <Typography display="flex" justifyContent="space-between" width="100%">
                {t('temperature')}: {weatherData.current[`temp_${unit.toLowerCase()}`]}{t(`degrees.${unit}`)}
            </Typography>
            <FormControl sx={{ marginTop: 2 }}>
                <InputLabel id="unit-select-label">{t('selectUnit')}</InputLabel>
                <Select
                    labelId="unit-select-label"
                    id="unit-select"
                    value={unit}
                    label={t('selectUnit')}
                    onChange={handleUnitChange}
                >
                    <MenuItem value={"C"}>{t('celsius')}</MenuItem>
                    <MenuItem value={"F"}>{t('fahrenheit')}</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
export default WeatherDisplay;
