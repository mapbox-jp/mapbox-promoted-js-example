import React, { useState } from 'react';
import { Container, Input, File } from './styles';

const ADID_NO = 7;

type Props = {
  onLoad: (data: any) => void;
};

const FeatureExtentions: React.FC<Props> = props => {
  const { onLoad } = props;
  const [fileName, setFileName] = useState('Choose file');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length <= 0) {
      return;
    }
    const file = event.target.files[0];
    setFileName(file.name);
    readFile(file);
  };
  const readFile = (file: File) => {
    let fileReader = new FileReader();
    fileReader.onload = () => readCSV(fileReader.result as string);
    fileReader.readAsText(file);
  };
  const readCSV = (text: string) => {
    const stringArray = text.split(/\r\n|\n|\r/g);
    stringArray.shift();
    const analitics = {};
    for (const line of stringArray) {
      const array = line.split(',');
      const adid = array[ADID_NO];
      analitics[adid] = array;
    }
    onLoad(analitics);
  };
  return (
    <Container>
      <Input type='file' accept='.csv' onChange={handleChange} />
      <File>{fileName}</File>
    </Container>
  );
};

export default FeatureExtentions;
