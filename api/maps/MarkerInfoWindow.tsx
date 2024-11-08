import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import {
  AdvancedMarker,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import energyStorage from '../../assets/Custom-Markers/energy_storage.svg';
import geothermal from '../../assets/Custom-Markers/geothermal.svg';
import hydroelectric from '../../assets/Custom-Markers/hydroelectric.svg';
import landbased_wind from '../../assets/Custom-Markers/landbased_wind.svg';
import offshore_wind from '../../assets/Custom-Markers/offshore_wind.svg';
import pumped_storage from '../../assets/Custom-Markers/pumped_storage.svg';
import solarPower from '../../assets/Custom-Markers/solar_power.svg';

const technologyToPin: Record<string, string> = {
  'Energy Storage': energyStorage,
  Geothermal: geothermal,
  Hydroelectric: hydroelectric,
  'Land-Based Wind': landbased_wind,
  'Offshore Wind': offshore_wind,
  'Pumped Storage': pumped_storage,
  Solar: solarPower,
};

export const MarkerInfoWindow = ({
  position,
  projectId,
  projectName,
  projectDev,
  technology,
  onMarkerClick,
  clusterer,
  selectedProjectId,
}: {
  position: { lat: number; lng: number };
  projectId: number;
  projectName: string;
  projectDev: string;
  technology: string;
  onMarkerClick: (
    projectId: number,
    position: { lat: number; lng: number },
  ) => void;
  clusterer: MarkerClusterer | null;
  selectedProjectId: number | null;
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // open infowindow when marker is hovered and not already open
  const handleMarkerEnter = useCallback(() => {
    if (!infoWindowShown) {
      setInfoWindowShown(true);
    }
  }, [infoWindowShown]);

  // close infowindow when modal is closed
  const handleClose = useCallback(() => {
    if (!modalOpen) {
      setInfoWindowShown(false);
    }
  }, [modalOpen]);

  const handleMarkerClick = () => {
    onMarkerClick(projectId, position);
    setModalOpen(!modalOpen);

    // toggle infowindow when marker is clicked
    if (!modalOpen) {
      setInfoWindowShown(true);
    } else {
      setInfoWindowShown(false);
    }
  };

  useEffect(() => {
    // close infowindow and modal if new marker is clicked
    if (selectedProjectId !== projectId) {
      setInfoWindowShown(false);
      setModalOpen(false);
    }
  }, [selectedProjectId, projectId]);

  useEffect(() => {
    if (marker && clusterer) {
      clusterer.addMarker(marker);
    }
  });

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onMouseEnter={handleMarkerEnter}
        onMouseLeave={handleClose}
        onClick={handleMarkerClick}
      >
        {technology in technologyToPin ? (
          <Image
            src={technologyToPin[technology]}
            alt={`Marker pin for ${technology}`}
            style={{ width: '75%' }}
          />
        ) : (
          <Pin />
        )}
      </AdvancedMarker>
      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose} disableAutoPan={true}>
          <h2>{projectName}</h2>
          <p>Developer: {projectDev}</p>
        </InfoWindow>
      )}
    </>
  );
};
