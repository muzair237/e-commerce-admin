import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

const ImageComponent = ({
  src,
  alt,
  width,
  height,
  layout = 'intrinsic',
  objectFit = 'cover',
  className = '',
  ...props
}) => (
  <Image
    src={src}
    alt={alt}
    width={width}
    height={height}
    layout={layout}
    objectFit={objectFit}
    className={className}
    {...props}
  />
);

ImageComponent.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  layout: PropTypes.oneOf(['intrinsic', 'fixed', 'responsive', 'fill']),
  objectFit: PropTypes.oneOf(['contain', 'cover', 'fill', 'none', 'scale-down']),
  className: PropTypes.string,
};

ImageComponent.defaultProps = {
  layout: 'intrinsic',
  objectFit: 'cover',
  className: '',
};

export default ImageComponent;
