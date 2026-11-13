import educationProgrammeImage from '@assets/education/education-programme.jpg';

export function getProgrammeImageUrl(
  icon: string | null | undefined,
  imageUrl: string | null | undefined,
) {
  return icon === 'education' ? educationProgrammeImage : imageUrl;
}
