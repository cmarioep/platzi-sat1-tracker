import { createContext, useState } from "react";

// init a context to share common data
export const SatelliteContext = createContext();

// Wrapper functional component as provider
export const SatelliteProvider = ({ children }) => {

    const [satellitePosition, setSatellitePosition] = useState(null);
    const [showSatelliteInfo, setShowSatelliteInfo] = useState(false);

    return (
        <SatelliteContext.Provider value={{ satellitePosition, setSatellitePosition, showSatelliteInfo, setShowSatelliteInfo }}>
            {children}
        </SatelliteContext.Provider>
    )

}