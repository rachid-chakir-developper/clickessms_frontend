import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import OrganizationCard from './OrganizationCard';

const OrganizationChart = ({ organization = {}, loading, error }) => {
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
        <Alert severity="error">{error.message || 'Erreur lors du chargement de l’organigramme.'}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: 'auto', padding: 4 }}>
      {organization.employee && (
        <Tree
          lineWidth="2px"
          lineColor="#ccc"
          lineBorderRadius="8px"
          label={<OrganizationCard employee={organization.employee} color={organization.color} />}
        >
          {organization.children?.map((child, index) => (
            <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
          ))}
        </Tree>
      )}
    </Box>
  );
};

export default OrganizationChart;
