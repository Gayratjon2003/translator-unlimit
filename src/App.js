import React, { useEffect, useState } from "react";
import { Typography, Col, Row, Input, Select, Button } from "antd";
import { contriesData } from "./countriesData";
import "./App.css";
import axios from "axios";
import { CopyOutlined, SwapOutlined } from "@ant-design/icons";
const { Title } = Typography;
const { TextArea } = Input;
function App() {
  const [inputVal, setInputVal] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("uz");
  const [translatedText, setTranslatedtext] = useState("");
  const [loading, setLoading] = useState("Translation");
  const [leftCopyBtn, setLeftCopyBtn] = useState(false);
  const [rightCopyBtn, setRightCopyBtn] = useState(false);
  const [defaultFromLang, setDefaultFromLang] = useState({
    value: "en",
    label: "English",
  });
  const [defaultToLang, setDefaultToLang] = useState({
    value: "uz",
    label: "Uzbek",
  });
  useEffect(() => {
    contriesData.map((item) => {
      if (item.language == fromLang) {
        setDefaultFromLang({
          value: fromLang,
          label: item.name,
        });
      }
    });
  }, [fromLang]);
  useEffect(() => {
    contriesData.map((item) => {
      if (item.language == toLang) {
        setDefaultToLang({
          value: toLang,
          label: item.name,
        });
      }
    });
  }, [toLang]);

  const encodedParams = new URLSearchParams();
  encodedParams.append("from", fromLang);
  encodedParams.append("to", toLang);
  encodedParams.append("text", inputVal);

  const SwapFunc = () => {
    const arrayTextArea = [inputVal, translatedText];
    const arrayLangs = [fromLang, toLang];
    setFromLang(arrayLangs[1]);
    setToLang(arrayLangs[0]);
    setTranslatedtext(arrayTextArea[0]);
    setInputVal(arrayTextArea[1]);
    copiedBtn();
  };
  const getRequest = () => {
    copiedBtn();
    setLoading("Translating...");
    const options = {
      method: "POST",
      url: "https://translo.p.rapidapi.com/api/v3/translate",
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': '0a4a90e165msh1c8cc73b48aa9aep1dd97djsn56f4bec7459d',
        'X-RapidAPI-Host': 'translo.p.rapidapi.com'
      },
      data: encodedParams,
    };

    axios
      .request(options)
      .then(function (response) {
        setTranslatedtext(response.data?.translated_text);
        setLoading("");
      })
      .catch(function (error) {
        setLoading("Please choose language");
      });
  };
  const onChangeGetVal = (e) => {
    setInputVal(e.target.value);
    if (e.target.value === "") {
      setLoading("Translation");
    }
  };
  const onChangeGetFirstLang = (value) => {
    setFromLang(value);
    copiedBtn();
  };
  const onChangeGetSecondLang = (value) => {
    setToLang(value);
    copiedBtn();
  };
  const languagesDataForSelect = [];
  contriesData.map((item) => {
    languagesDataForSelect.push({ value: item.language, label: item.name });
  });
  const copiedBtn = () => {
    setLeftCopyBtn(false);
    setRightCopyBtn(false);
  };
  return (
    <>
      <div className="header">
        <div className="top">
          <Title className="top-title">Translator</Title>
        </div>
        <Row className="box-textarea">
          <Col className="box-textarea-child box-textarea-child-top">
            <div className="select-box">
              <Select
                showSearch
                value={defaultFromLang}
                className="select-left"
                placeholder="Select a language"
                optionFilterProp="children"
                onChange={(val) => onChangeGetFirstLang(val)}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={languagesDataForSelect}
              />
            </div>
            <TextArea
              showCount
              style={{ height: 200, resize: "none" }}
              onChange={(e) => onChangeGetVal(e)}
              value={inputVal}
            />
            <CopyOutlined
              className={`copy-icon-left ${
                leftCopyBtn ? "copy-icon-left-clicked" : ""
              }`}
              onClick={() => (
                navigator.clipboard.writeText(inputVal), setLeftCopyBtn(true)
              )}
            />
          </Col>
          <Col
            className="box-textarea-child box-textarea-child-center"
            style={{ margin: "0px 15px" }}
          >
            <Button onClick={() => SwapFunc()} className="swapBtn">
              <SwapOutlined />
            </Button>
            <Button type="primary" onClick={() => getRequest()}>
              Translate
            </Button>
          </Col>
          <Col className="box-textarea-child box-textarea-child-bottom">
            <div className="select-box">
              <Select
                showSearch
                className="select-right"
                value={defaultToLang}
                placeholder="Select a language"
                optionFilterProp="children"
                onChange={(val) => onChangeGetSecondLang(val)}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={languagesDataForSelect}
              />
            </div>
            <TextArea
              showCount
              className="textarea-right"
              style={{ height: 200, resize: "none" }}
              placeholder={loading}
              readOnly
              value={translatedText}
            />
            <CopyOutlined
              className={`copy-icon-left ${
                rightCopyBtn ? "copy-icon-left-clicked" : ""
              }`}
              onClick={() => (
                navigator.clipboard.writeText(translatedText), setRightCopyBtn(true)
              )}
            />
          </Col>
        </Row>
      </div>
      <div className="footer">
        <p>
          All rights reserved
          <span>
            Created by{" "}
            <a href="https://gayratjon.uz/" target="_blank">
              Gayratjon Abdijobborov
            </a>
          </span>
          <a href="https://Gayratjon2003.github.io/Translator" target="_blank">
            Auto translate website
          </a>
        </p>
      </div>
    </>
  );
}

export default App;
