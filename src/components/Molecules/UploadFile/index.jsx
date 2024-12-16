import React, { useState } from 'react';
import { Row, Col, Card } from 'reactstrap';
import Dropzone from 'react-dropzone';

import { formatBytes } from '@/helpers/common';
import Image from '@/components/Atoms/Image';
import Anchor from '../Anchor';

const UploadFile = ({ handleChange, ...props }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const onChange = files => {
    // Map over all the files and add preview and formatted size
    const updatedFiles = files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      }),
    );

    setSelectedFiles(prev => [...prev, ...updatedFiles]);
  };

  return (
    <div style={{ width: '100%', cursor: 'pointer' }} className="">
      <Dropzone multiple {...props} onDrop={acceptedFiles => onChange(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone dz-clickable" {...getRootProps()}>
            <div className="dz-message needsclick">
              <div className="mb-3">
                <i className="display-4 text-muted ri-upload-cloud-2-fill" />
              </div>
              <h4>Drop file here or click to upload.</h4>
            </div>
            <input {...getInputProps()} />
          </div>
        )}
      </Dropzone>

      {selectedFiles.map(f => (
        <Anchor key={f.preview} href={f.preview} target="_blank" className="text-muted font-weight-bold">
          <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete">
            <div className="p-2">
              <Row className="align-items-center">
                <Col className="col-auto">
                  <Image
                    data-dz-thumbnail=""
                    width={140}
                    height={80}
                    className="avatar-sm rounded bg-light"
                    alt={f.name}
                    src={f.preview}
                  />
                </Col>
                <Col>
                  {f.name}
                  <p className="mb-0">
                    <strong>{f.formattedSize}</strong>
                  </p>
                </Col>
              </Row>
            </div>
          </Card>
        </Anchor>
      ))}
    </div>
  );
};

export default UploadFile;
