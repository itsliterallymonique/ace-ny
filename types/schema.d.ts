import React from 'react';

export type Project = {
  id: number;
  project_name: string;
  renewable_energy_technology: string;
  size: number;
  developer: string;
  longitude: number;
  latitude: number;
  project_status: string;
  county: string;
  town: string;
  region: string;
  state_senate_district: number;
  assembly_district: number;
  project_image: string | null;
  additional_information: string | null;
  key_development_milestones: Milestone[] | null;
  permit_process: string | null;
  proposed_cod: Date;
  approved: boolean;
};

export interface Option {
  title: string;
  icon: React.ReactNode;
}

export interface Filter {
  id: string;
  label: string;
  icon: React.ReactNode;
  categories: { category: string; options: Option[] }[];
}

export interface SVGIconProps {
  src: string;
  alt: string;
}
