import React from 'react';

interface SvgIconProps {
  iconData: {
    id: string;
    name: string;
    svg: string;
    baseColor?: string;
  };
  size?: number;
  className?: string;
  variant?: 'normal' | 'different';
}

const SvgIcon: React.FC<SvgIconProps> = ({ 
  iconData, 
  size = 80, 
  className = '', 
  variant = 'normal' 
}) => {
  // Create a modified version for the "different" variant
  const getModifiedSvg = (svgString: string, variant: string) => {
    if (variant === 'different') {
      // Apply specific color changes for each icon type
      if (iconData.id === 'elastic-logo') {
        return svgString
          .replace(/fill="#FEC514"/g, 'fill="TEMP_ELASTIC_YELLOW"')
          .replace(/fill="#02BCB7"/g, 'fill="#FEC514"')
          .replace(/fill="TEMP_ELASTIC_YELLOW"/g, 'fill="#02BCB7"');
      } else if (iconData.id === 'elasticsearch') {
        return svgString
          .replace(/fill="#FEC514"/g, 'fill="TEMP_ES_YELLOW"')
          .replace(/fill="#00BFB3"/g, 'fill="#FEC514"')
          .replace(/fill="TEMP_ES_YELLOW"/g, 'fill="#00BFB3"');
      } else if (iconData.id === 'observability') {
        return svgString
          .replace(/fill="#F04E98"/g, 'fill="TEMP_PINK"')
          .replace(/fill="#0077CC"/g, 'fill="#F04E98"')
          .replace(/fill="TEMP_PINK"/g, 'fill="#0077CC"');
      } else if (iconData.id === 'security') {
        return svgString
          .replace(/fill="#00BFB3"/g, 'fill="#FF6B35"');
      } else if (iconData.id === 'eye') {
        return svgString
          .replace(/fill="#0B64DD"/g, 'fill="TEMP_INNER_BLUE"')
          .replace(/fill="#48EFCF"/g, 'fill="#0B64DD"')
          .replace(/fill="TEMP_INNER_BLUE"/g, 'fill="#48EFCF"');
      } else if (iconData.id === 'malware') {
        return svgString
          .replace(/fill="#153385"/g, 'fill="#4A148C"')
          .replace(/fill="#0B64DD"/g, 'fill="#7B1FA2"');
      }
      
      return svgString;
    }
    return svgString;
  };

  const modifiedSvg = getModifiedSvg(iconData.svg, variant);

  return (
    <div 
      className={`inline-block ${className}`}
      style={{ width: size, height: size, pointerEvents: 'none' }}
      dangerouslySetInnerHTML={{ 
        __html: modifiedSvg.replace(
          /width="[\d.]+" height="[\d.]+"/,
          `width="${size}" height="${size}"`
        )
      }}
    />
  );
};

export default SvgIcon;