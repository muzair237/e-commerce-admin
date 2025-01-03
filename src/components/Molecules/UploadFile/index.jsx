import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card } from 'reactstrap';
import Dropzone from 'react-dropzone';

import { formatBytes } from '@/helpers/common';
import Image from '@/components/Atoms/Image';
import Button from '@/components/Atoms/Button';
import Anchor from '../Anchor';
import { UploadFileWrapper } from './UploadFile.styles';
import { Toast } from '../Toast';

const UploadFile = ({
  isInvalid,
  multiple = false,
  maxFiles = 1,
  accept = { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] },
  onChange,
  fileSize = 1,
  displayFile,
  ...props
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = files => {
    if (!files.length) {
      return;
    }

    if (multiple) {
      const oversizedFiles = files.filter(file => file.size / (1024 * 1024) > fileSize);

      if (oversizedFiles.length > 0) {
        oversizedFiles.forEach(file => {
          Toast({
            type: 'error',
            message: `${file.name} has size greater than ${fileSize} MB!`,
          });
        });

        return;
      }
    } else {
      const [selectedFile] = files;
      const fileLengthMB = selectedFile.size / (1024 * 1024);

      if (fileLengthMB > fileSize) {
        Toast({
          type: 'error',
          message: `File must not be greater than ${fileSize} MB!`,
        });

        return;
      }
    }

    const updatedFiles = files.map(file => ({
      ...file,
      name: file.name,
      preview: URL.createObjectURL(file),
      formattedSize: formatBytes(file.size),
    }));

    if (multiple) {
      onChange(files);
    } else {
      onChange(files[0]);
    }

    setSelectedFiles(prev => {
      if (multiple) {
        const totalFiles = [...prev, ...updatedFiles];

        return totalFiles.slice(0, maxFiles);
      }

      return updatedFiles;
    });
  };

  const getExtensions = () =>
    Object.values(accept)
      .flat()
      .join(', ')
      .replace(/, ([^,]*)$/, ' and $1');

  const handleDelete = fileToDelete => {
    setSelectedFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(file => file.preview !== fileToDelete.preview);

      onChange(updatedFiles.length > 0 ? updatedFiles : null);

      return updatedFiles;
    });
  };

  useEffect(() => {
    if (displayFile) {
      const newFiles = multiple
        ? displayFile.map(file => ({
            name: 'Tap to preview',
            preview: file,
          }))
        : [
            {
              name: 'Tap to preview',
              preview: displayFile,
            },
          ];

      setSelectedFiles(newFiles);
    }
  }, [displayFile, multiple]);

  return (
    <UploadFileWrapper $shouldPoint={selectedFiles.length < maxFiles} $isInvalid={isInvalid}>
      <Dropzone
        disabled={selectedFiles.length >= maxFiles}
        maxFiles={maxFiles}
        {...props}
        accept={accept}
        file
        multiple={multiple}
        onDrop={acceptedFiles => handleChange(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone dz-clickable" {...getRootProps()}>
            <div className="dz-message needsclick">
              <div className="mb-3">
                <i className="display-4 text-muted ri-upload-cloud-2-fill" />
              </div>
              <h4>Drop {multiple ? 'files' : 'file'} here or click to upload.</h4>
              <p className="fs-6">
                File must be in {getExtensions()} format.
                {multiple && !!maxFiles && <span> You can upload up to {maxFiles} files.</span>}
              </p>
            </div>

            <input {...getInputProps()} />
          </div>
        )}
      </Dropzone>

      {/* Display selected file */}
      {selectedFiles.length > 0 &&
        selectedFiles.map(f => (
          <Card
            key={f.preview}
            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete">
            <div className="p-2">
              <Row className="align-items-center">
                <Col className="col-auto">
                  <Anchor href={f.preview} target="_blank" className="text-muted font-weight-bold">
                    <Image
                      data-dz-thumbnail=""
                      width={140}
                      height={80}
                      className="avatar-sm rounded bg-light"
                      alt={f.name}
                      src={f.preview}
                    />
                  </Anchor>
                </Col>
                <Col>
                  <Anchor href={f.preview} target="_blank" className="text-muted font-weight-bold">
                    {f.name}
                    <p className="mb-0">
                      <strong>{f.formattedSize}</strong>
                    </p>
                  </Anchor>
                </Col>
                <Col className="col-auto">
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDelete(f)}
                    style={{ fontSize: '14px', padding: '5px 10px' }}>
                    Delete
                  </Button>
                </Col>
              </Row>
            </div>
          </Card>
        ))}
    </UploadFileWrapper>
  );
};

UploadFile.propTypes = {
  isInvalid: PropTypes.bool.isRequired,
  multiple: PropTypes.bool,
  maxFiles: PropTypes.number,
  accept: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  fileSize: PropTypes.number,
  displayFile: PropTypes.string,
};

export default UploadFile;
