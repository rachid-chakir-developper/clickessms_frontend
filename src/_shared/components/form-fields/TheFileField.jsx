import * as React from "react";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import { Description, Close } from "@mui/icons-material";

export default function TheFileField(props) {
  const [uploadedFile, setUploadedFile] = React.useState({ path: null, localUrl: null, file: null });

  React.useEffect(() => {
    if (typeof props?.fileValue === "string") {
      setUploadedFile({ path: props?.fileValue, localUrl: null, file: null });
    }
  }, [props?.fileValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploaded = {
        localUrl: URL.createObjectURL(file),
        file: file,
      };
      setUploadedFile(uploaded);
      if (props?.onChange) props.onChange(file, uploaded, e);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile({ path: null, localUrl: null, file: null });
    if (props?.onChange) props.onChange(null, null, null);
  };

  return (
    <Card sx={{ display: "flex", alignItems: "center", padding: 2 }} variant="outlined">
      <Box sx={{ flexGrow: 1 }}>
        <CardContent sx={{ padding: "8px 16px" }}>
          <Typography variant="subtitle1" color="text.secondary">
            {props?.label}
          </Typography>
          {uploadedFile.file || uploadedFile.path ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: 1 }}>
              <IconButton
                component="a"
                href={uploadedFile.localUrl || uploadedFile.path}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "primary.main" }}
              >
                <Description sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="body2" color="text.secondary" noWrap>
                {uploadedFile.file?.name || props?.label}
              </Typography>
              <IconButton
                onClick={handleRemoveFile}
                sx={{
                  backgroundColor: "error.main",
                  color: "white",
                  "&:hover": { backgroundColor: "error.dark" },
                }}
              >
                <Close />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ marginTop: 1 }}>
              <input
                type="file"
                id="file-input"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <label htmlFor="file-input">
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 16px",
                    border: "1px dashed",
                    borderColor: "primary.main",
                    borderRadius: "4px",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "primary.light",
                      borderColor: "primary.dark",
                    },
                  }}
                >
                  <Typography variant="body2" color="primary.main">
                    Cliquez pour sélectionner un fichier
                  </Typography>
                </Box>
              </label>
            </Box>
          )}
        </CardContent>
      </Box>
    </Card>
  );
}
