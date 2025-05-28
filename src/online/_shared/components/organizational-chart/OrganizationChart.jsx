import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Grid,
} from '@mui/material';
import OrganizationCard from './OrganizationCard';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PictureAsPdf } from '@mui/icons-material';

const OrganizationChart = ({ organization = {}, loading, error }) => {
  const { organizationTree, currentDate, company } = organization || {};
  const chartRef = React.useRef();
  const detachedMembers = [];

  const exportToPDF = async () => {
    const input = chartRef.current;
    if (!input) return;

    try {
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const fileName = `organigramme-${company?.name || 'association'}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("Erreur lors de l’export en PDF:", err);
    }
  };

  const isDetached = (node) => {
    return node?.employee?.role_code === 'MEMBER' || node?.employee?.role_code === 'OTHER';
  };

  const filterTree = (node) => {
    if (!node) return null;

    if (isDetached(node)) {
      detachedMembers.push(node);
      return null;
    }

    const filteredChildren = node.children
      ?.map(filterTree)
      .filter((child) => child !== null);

    return {
      ...node,
      children: filteredChildren,
    };
  };

  const renderNode = (node) => {
    if (!node) return null;

    const { employee, color, label, children = [] } = node;

    const labelNode = employee ? (
      <OrganizationCard employee={employee} color={color} />
    ) : (
      <Typography
        variant="caption"
        sx={{
          textAlign: 'center',
          color: color || 'text.secondary',
          fontWeight: 'bold',
          mb: 1,
        }}
      >
        {label}
      </Typography>
    );

    return (
      <TreeNode label={labelNode}>
        {children.map((child, index) => (
          <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
        ))}
      </TreeNode>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Erreur lors du chargement de l’organigramme.</Alert>
      </Box>
    );
  }

  const filteredOrganization = filterTree(organizationTree);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
        <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={exportToPDF}>
          Exporter en PDF
        </Button>
      </Box>

      <Box
        ref={chartRef}
        id="org-chart"
        sx={{
          overflowX: 'auto',
          padding: 4,
          background: '#fff',
          textAlign: 'center',
        }}
      >
        {company && (
          <Box sx={{ mb: 4 }}>
            {company.logo && (
              <Box sx={{ mb: 2 }}>
                <img
                  src={company.logo}
                  alt={`Logo de ${company.name}`}
                  style={{ maxHeight: 80, objectFit: 'contain' }}
                />
              </Box>
            )}
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Organigramme Gouvernance "{company.name}"
            </Typography>
            {currentDate && (
              <Typography variant="subtitle2" color="text.secondary">
                Généré le {new Date(currentDate).toLocaleDateString('fr-FR')}
              </Typography>
            )}
          </Box>
        )}

        {filteredOrganization?.employee && (
          <Tree
            lineWidth="2px"
            lineColor="#ccc"
            lineBorderRadius="8px"
            label={
              <OrganizationCard
                employee={filteredOrganization.employee}
                color={filteredOrganization.color}
              />
            }
          >
            {filteredOrganization.children?.map((child, index) => (
              <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
            ))}
          </Tree>
        )}

        {detachedMembers.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="flex-start"
              flexWrap="wrap"
            >
              {detachedMembers.map((node, idx) => (
                <Grid item key={idx} xs={12} sm={6} md={4} lg={3}>
                  <OrganizationCard employee={node.employee} color={node.color} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </>
  );
};

export default OrganizationChart;
