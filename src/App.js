import React, { useState } from "react";
import { Form, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function App() {
  const [validateStatus, setValidateStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const XLSX = require("xlsx");

  const uploadprops = {
    name: "file",
    headers: {
      authorization: "authorization-text",
    },
    showUploadList: false,
    beforeUpload: (file, fileList) => {
      let rABS = true;
      const f = fileList[0];
      let reader = new FileReader();
      reader.onload = function (e) {
        let data = e.target.result;
        let workbook = XLSX.read(data, {
          type: rABS ? "binary" : "array",
        });
        let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let jsonArr = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
        console.log("ARRAY OF ARRAY FROM XLSX -->", jsonArr);
        let withoutSpaceArr = [...jsonArr].map((e) =>
          e.map((f) => (typeof f == "string" ? f.trim() : f))
        );
        let keys = withoutSpaceArr.shift();
        jsonArr = [];
        withoutSpaceArr.map((inner) => {
          let obj = keys.reduce((x, value) => {
            return { ...x, [value]: "" };
          }, {});
          keys.map((e, i) => (obj[e] = inner[i]));
          jsonArr.push(obj);
        });
        console.log("JSON FORMAT -->", jsonArr);
        // console.log("JSON FORMAT -->", JSON.stringify(jsonArr));
      };
      if (rABS) reader.readAsBinaryString(f);
      else reader.readAsArrayBuffer(f);
      return false;
    },
  };

  return (
    <>
      <div>
        <h1>Excel to JSON</h1>
        <hr />
        <Form>
          <Form.Item validateStatus={validateStatus} help={errorMessage}>
            <Upload.Dragger {...uploadprops} multiple listType="picture-card">
              Drag Files Here or Upload
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
