import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Container, Typography, Box, Grid, Button } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import LocationSearch from "./components/LocationSearch/LocationSearch";
import WeatherDisplay from "./components/WeatherDisplay/WeatherDisplay";
import FavoritesList from "./components/FavoritesList/FavoritesList";
import "leaflet/dist/leaflet.css";
import styles from './App.module.css';
import i18n from 'i18next';

export default function App() {

const { t } = useTranslation();

const [location, setLocation] = useState("");
const [loading, setLoading] = useState(false);
const [weatherData, setWeatherData] = useState(null);
const [error, setError] = useState("");
const [favorites, setFavorites] = useState([]);
const [selectedLocation, setSelectedLocation] = useState(null);


const API_WEATHER = `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_API_KEY}&q=`;

    const validateLocationInput = (location) => {
        const trimmedLocation = location.trim();
        if (!trimmedLocation) {
            throw new Error(t("error_city_field_required"));
        }
        return trimmedLocation;
    };

    const handleApiResponse = async (response) => {
        if (!response.ok) {
            switch (response.status) {
                case 400:
                    throw new Error(t("error_city_not_found"));
                default:
                    throw new Error(t("error_unknown"));
            }
        }
        return await response.json();
    };

    const validateApiData = (data, trimmedLocation) => {
        const locationNameFromApi = data.location?.name?.trim().toLowerCase();
        if (locationNameFromApi !== trimmedLocation.toLowerCase()) {
            throw new Error(`${t("error_invalid_full_city_name")}: "${data.location.name}"`);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setWeatherData(null);
        setLoading(true);

        try {
            const trimmedLocation = validateLocationInput(location);

            const response = await fetch(`${API_WEATHER}${encodeURIComponent(trimmedLocation)}&aqi=no`);
            const data = await handleApiResponse(response);

            validateApiData(data, trimmedLocation);
            setWeatherData(data);
        } catch (error) {
            setError(error.message || t("error_unknown"));
        } finally {
            setLoading(false);
        }
    };

    const addFavorite = async () => {
        try {
            const trimmedLocation = location.trim();

            if (!trimmedLocation) {
                throw new Error(t('error_city_field_required'));
            }
            const alreadyFavorite = favorites.some(
                (fav) => fav.trim().toLowerCase() === trimmedLocation.toLowerCase()
            );

            if (alreadyFavorite) {
                throw new Error(t('error_location_already_favorite'));
            }
            const response = await fetch(`${API_WEATHER}${trimmedLocation}&aqi=no`);

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error(t('error_city_not_found'));
                } else {
                    throw new Error(t('error_unknown'));
                }
            }

            const data = await response.json();

            setFavorites([...favorites, data.location.name]);
            setError(""); 
        } catch (error) {
            setError(error.message);
        }
    };



    const onSelectLocation = async (selectedLocation) => {
        setLocation(selectedLocation); 
        setSelectedLocation(selectedLocation); 

        try {
            const response = await fetch(`${API_WEATHER}${selectedLocation}&aqi=no`);
            if (!response.ok) throw new Error(t('error_city_not_found'));

            const data = await response.json();
            setWeatherData(data);

        } catch (error) {
            setError(error.message || t('error_unknown'));
        }
    };


    const weatherIcon = weatherData?.current && new L.Icon({
        iconUrl: `https:${weatherData.current.condition.icon}`,
        iconSize: [40, 40],
        iconAnchor: [25, 25],
        popupAnchor: [0, -25],
    });

    return (
    
        <Container className={styles.container}>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography className={styles.title} variant="h4" gutterBottom align="center">
                        {t('ayesa_weather_app')}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={5}>
                    <LocationSearch location={location} setLocation={setLocation} onSubmit={onSubmit} loading={loading} onAddFavorite={addFavorite} />

                    {error && (
                        <Typography className={styles.errorText}>
                            {error}
                        </Typography>
                    )}

                    <Box sx={{ height: "400px", width: "100%", position: "relative", mt: 2 }}>
                        {weatherData && weatherIcon && (
                            <MapContainer
                                center={[weatherData.location.lat, weatherData.location.lon]}
                                zoom={3}
                                style={{ height: "100%" }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker
                                    position={[weatherData.location.lat, weatherData.location.lon]}
                                    icon={weatherIcon}
                                >
                                    <Popup>
                                        <Typography variant="body2">
                                            {weatherData.location.name}
                                            <br />
                                            {weatherData.current.condition.text}
                                        </Typography>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        )}
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <WeatherDisplay weatherData={weatherData} />
                    </Box>

                </Grid>

                <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    <Button
                        variant="outlined"
                        onClick={addFavorite}
                        className={styles.addFavoriteButton}
                    >
                        {t('add_to_favorites')}
                    </Button>
                        <FavoritesList favorites={favorites} onSelectLocation={onSelectLocation} />
                    </Box>

                </Grid>
                <Grid item xs={12} md={1}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                        <Button
                            onClick={() => i18n.changeLanguage('en')}
                            sx={{
                                whiteSpace: 'nowrap',
                                padding: 0,
                                border: '1px solid',
                            }}
                        >
                            EN
                        </Button>
                        <Button
                            onClick={() => i18n.changeLanguage('es')}
                            sx={{
                                whiteSpace: 'nowrap',
                                padding: 0,
                                border: '1px solid',
                            }}
                        >
                            ES
                        </Button>
                    </Box>
                </Grid>

            </Grid>

                <Typography className={styles.footer} align="center">
                        
                {t('weather_data_provided_by')}:{" "}
                <a
                    href="https://www.weatherapi.com/"
                    title="Weather API"
                >
                    WeatherAPI.com
                </a>
                </Typography>

        </Container>
    );

}