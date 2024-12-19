import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';

import { getSkeletonStyle } from '@/helpers/common';
import 'react-loading-skeleton/dist/skeleton.css';

const ReactSkeletonComponent = ({ width, height }) => {
  const skeletonStyle = getSkeletonStyle();

  return <Skeleton style={skeletonStyle} width={width} height={height} />;
};

ReactSkeletonComponent.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default ReactSkeletonComponent;
