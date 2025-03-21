import { useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Cluster, MarkerClusterer } from '@googlemaps/markerclusterer';
import { useMap } from '@vis.gl/react-google-maps';
import { ClusterIcon } from '@/assets/Clusters/icons';
import { Project } from '../../types/schema';
import { MarkerInfoWindow } from './MarkerInfoWindow';

export default function AddMarker({
  projects,
  filteredProjects,
  selectedProjectId,
  map,
  setSelectedProjectId,
  setMap,
}: {
  projects: Project[] | null;
  filteredProjects: Project[] | null;
  selectedProjectId: number | null;
  map: google.maps.Map | null;
  setSelectedProjectId: React.Dispatch<React.SetStateAction<number | null>>;
  setMap: React.Dispatch<React.SetStateAction<google.maps.Map | null>>;
}) {
  setMap(useMap());

  const handleMarkerClick = (
    projectId: number,
    position: { lat: number; lng: number },
  ) => {
    setSelectedProjectId(prevId => (prevId === projectId ? null : projectId)); // close modal if same, open if different
    map?.panTo(position); // change center of map to selected marker
    if (selectedProjectId === projectId) {
      document.title = 'ACE NY';
    }
  };
  /*
  function euclideanDistance(point1: number[], point2: number[]): number {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  const getMinZoom = function (cluster: Cluster, mapZoom: number): number {
    const numMarkers = cluster.markers?.length ?? 0;
    const markers = cluster.markers ?? [];
    if (numMarkers === 2) {
      const marker1Position = (
        markers[0] as google.maps.marker.AdvancedMarkerElement
      ).position ?? { lat: 0, lng: 0 };
      const marker2Position = (
        markers[1] as google.maps.marker.AdvancedMarkerElement
      ).position ?? { lat: 0, lng: 0 };
      const distance = euclideanDistance(
        Object.values(marker1Position),
        Object.values(marker2Position),
      );

      const maxZoom = 11.5;
      const minZoom = 6;
      const maxDistance = 15;

      let zoom = Math.max(
        minZoom,
        Math.min(
          maxZoom,
          minZoom +
            ((maxDistance - distance) / maxDistance) * (maxZoom - minZoom),
        ),
      );

      const projection = map?.getProjection();
      const point1 = projection?.fromLatLngToPoint(marker1Position);
      const point2 = projection?.fromLatLngToPoint(marker2Position);

      const point1x = point1?.x ?? 0;
      const point1y = point1?.y ?? 0;
      const point2x = point2?.x ?? 0;
      const point2y = point2?.y ?? 0;

      const pixelDistance = Math.sqrt(
        Math.pow(point2x - point1x, 2) + Math.pow(point2y - point1y, 2),
      );

      if (pixelDistance > 0.3) {
        zoom = zoom - 1; // slight zoom out for large screen distances
      }
      if (pixelDistance < 0.15) {
        zoom = zoom + 1; // slight zoom in for small screen distances
      }
      return zoom;
    }
    return mapZoom;
  };
*/

  const clusterer = useMemo(() => {
    if (!map) return null;

    const renderer = {
      render(cluster: Cluster) {
        const count = cluster.markers?.length ?? 0;
        const position = cluster.position;

        // create a container for the custom icon
        const container = document.createElement('div');
        const root = ReactDOM.createRoot(container);
        root.render(<ClusterIcon count={count} />);
        return new google.maps.marker.AdvancedMarkerElement({
          position: position,
          content: container,
        });
      },
    };

    const clusterHandler = (
      event: google.maps.MapMouseEvent,
      cluster: Cluster,
      map: google.maps.Map,
    ) => {
      if (event.latLng) {
        const mapZoom = (map.getZoom() ?? 0) + 3;
        map.setCenter(event.latLng);
        map.setZoom(mapZoom);
      }
    };

    const setClusterer = new MarkerClusterer({
      map,
      renderer,
      onClusterClick: clusterHandler,
    });

    return setClusterer;
  }, [map]);

  const markerMap = useRef<Map<number, google.maps.Marker>>(new Map());

  const hideMarker = (marker: google.maps.Marker) => {
    marker.setMap(null);
  };

  const showMarker = (marker: google.maps.Marker, map: google.maps.Map) => {
    marker.setMap(map);
  };

  useEffect(() => {
    // Iterate through the filtered projects to update the visibility of each marker
    projects?.forEach(project => {
      const marker = markerMap.current.get(project.id);

      if (marker) {
        // Check if the project is in the filtered list
        const isInFilteredProjects = filteredProjects?.some(
          filteredProject => filteredProject.id === project.id,
        );

        if (isInFilteredProjects && map) {
          showMarker(marker, map);
        } else {
          hideMarker(marker);
        }
      }
    });
  }, [filteredProjects, map, projects]);

  // Re-rendering clusters based on filtered projects
  useEffect(() => {
    if (!clusterer || !map) return;

    clusterer.clearMarkers();

    filteredProjects?.forEach(project => {
      const marker = markerMap.current.get(project.id);
      if (marker) {
        clusterer.addMarker(marker);
      }
    });
  }, [filteredProjects, clusterer, map]);

  return (
    <>
      {projects?.map((project: Project) => {
        return (
          <MarkerInfoWindow
            key={project.id}
            position={{
              lat: project.latitude,
              lng: project.longitude,
            }}
            projectName={project.project_name}
            technology={project.renewable_energy_technology}
            projectId={project.id}
            onMarkerClick={handleMarkerClick}
            clusterer={clusterer}
            selectedProjectId={selectedProjectId}
            markerMap={markerMap.current}
          />
        );
      })}
    </>
  );
}
