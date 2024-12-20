import React from 'react';
import PropTypes from 'prop-types';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import Image from '@/components/Atoms/Image';

SwiperCore.use([FreeMode, Navigation]);

const ProductImages = ({ images }) => (
  <Swiper navigation spaceBetween={20} className="swiper product-thumbnail-slider p-2 rounded bg-light">
    <div className="swiper-wrapper">
      {images?.map(ele => (
        <SwiperSlide key={ele}>
          <Image
            style={{ borderRadius: '13px' }}
            src={ele}
            width={500}
            height={500}
            alt=""
            className="img-fluid d-block"
          />
        </SwiperSlide>
      ))}
    </div>
  </Swiper>
);
ProductImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProductImages;
