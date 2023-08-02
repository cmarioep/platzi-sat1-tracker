import React from 'react';
import { twoline2satrec, propagate } from 'satellite.js';

const platziSatTLE1 = '1 88888U 24001FA  23163.94096086  .00000000  00000-0  10000-4 0  9999';
const platziSatTLE2 = '2 88888  97.5077 280.5424 0008220 228.6198 130.8530 15.11803180  1009'

export default function useSatellite () {

    /**
     * Returns a satellite record object based on the given TLE strings. useful for calculations.
     * @param {string} tle1 - The first line of the TLE.
     * @param {string} tle2 - The second line of the TLE.
     * @returns {Object} The satellite record object.
     */
    const getSatRec = ( tle1 = platziSatTLE1, tle2 = platziSatTLE2 ) => {
        const satrec = twoline2satrec(tle1, tle2);
        return satrec;
    }


    // Satellite info is an object with the position and velocity of the satellite in the given date. ECI coordenates format.

    /**
     * Returns an object with the position and velocity of the satellite in the given date. ECI coordinates format.
     * @param {Object} satrec - The satellite record object.
     * @param {Date} date - The date for which to get the satellite info.
     * @returns {Object} An object with the position and velocity of the satellite.
     */
    const getSatelliteInfo = ( satrec, date ) => {
        const positionAndVelocity = propagate(satrec, date);
        return positionAndVelocity;
    }

    /**
     * Converts ECI coordinates to LatLong coordinates.
     * @param {Object} position - An object with the x, y and z coordinates of the satellite in ECI format.
     * @returns {Object} An object with the latitude and longitude of the satellite.
     */
    const convertECItoLatLong = (position) => {
        const a = 6378.137;
        const b = 6356.752314245;
        const f = (a - b) / a;
        const eSq = f * (2 - f);
        const r = Math.sqrt(position.x ** 2 + position.y ** 2);
        const longitude = Math.atan2(position.y, position.x);
        const latitude = Math.atan2(position.z, r);
        const N = a / Math.sqrt(1 - eSq * Math.sin(latitude) ** 2);
        const height = r / Math.cos(latitude) - N;
        const latitudeDeg = latitude * 180 / Math.PI;
        const longitudeDeg = longitude * 180 / Math.PI;
        return { latitude: latitudeDeg, longitude: longitudeDeg, height };
    }

    /**
     * Returns an array filled with objects with the latitude and longitude of the satellite.
     * @param {Object} satRec - The satellite record object.
     * @param {Date} startTime - The time we want to start getting the positions.
     * @param {number} timeStep - The time between each position in milliseconds.
     * @param {number} numSteps - The number of positions we want to get.
     * @returns {Array} An array of objects with the latitude and longitude of the satellite.
     */

    // Here is an example:

    { /* 
        const startTime = new Date();
        const timeStep = 1000 * 60 ; // 1 minutes
        const numSteps = 20; // Number of steps in 20 minutes (1 minutes intervals)
    */}

    const predictSatellitePositions = (satRec, startTime, timeStep, numSteps) => {

        const positions = [];
        
        for (let i = 0; i < numSteps; i++) {

            // Propagate the satellite's orbit at the current time
            const positionAndVelocity = propagate(satRec, startTime);
            
            // Convert the ECI position to latitude and longitude
            const position = convertECItoLatLong(positionAndVelocity.position);
            
            // Add the position to the positions array
            positions.push({ latitude: position.latitude, longitude: position.longitude });
            
            // Increment the time for the next step
            startTime = new Date(startTime.getTime() + timeStep);
        }
            return positions;
        }

    /**
     * Returns an object with the user's latitude and longitude.
     * @returns {Object} An object with the user's latitude and longitude.
     */
    
    const getUserLocation = () => {
        return new Promise((resolve, reject) => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    };
                    resolve(userLocation);
                },
                (error) => {
                    console.error('Error getting user location:', error.message);
                    reject(error);
                }
                );
            } else {
                console.error('Geolocation is not supported in this browser.');
                reject(new Error('Geolocation is not supported in this browser.'));
            }
        });
    };

    /**
     * Calculates the distance between two points on the Earth's surface using the Haversine formula.
     * @param {number} lat1 - The latitude of the first point in degrees.
     * @param {number} lon1 - The longitude of the first point in degrees.
     * @param {number} lat2 - The latitude of the second point in degrees.
     * @param {number} lon2 - The longitude of the second point in degrees.
     * @returns {number} The distance between the two points in kilometers.
     */

    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {

        /**
         * Converts degrees to radians.
         * @param {number} deg - The angle in degrees.
         * @returns {number} The angle in radians.
         */
        
        const deg2rad = (deg) => {
            return deg * (Math.PI / 180);
        }

        const earthRadius = 6371; // Radius of the earth in kilometers
        const latDiffInRadians = deg2rad(lat2 - lat1); // Difference in latitude in radians
        const lonDiffInRadians = deg2rad(lon2 - lon1); // Difference in longitude in radians
        const a =
            Math.sin(latDiffInRadians / 2) * Math.sin(latDiffInRadians / 2) +
            Math.cos(deg2rad(lat1)) *
                Math.cos(deg2rad(lat2)) *
                Math.sin(lonDiffInRadians / 2) *
                Math.sin(lonDiffInRadians / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Central angle between the two points in radians
        const distance = earthRadius * c; // Distance between the two points in kilometers
        return distance;
    }

    return {
        getSatRec,
        getSatelliteInfo,
        convertECItoLatLong,
        predictSatellitePositions,
        getUserLocation,
        getDistanceFromLatLonInKm
    }

}