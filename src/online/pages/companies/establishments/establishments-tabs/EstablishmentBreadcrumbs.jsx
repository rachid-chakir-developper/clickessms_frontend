import * as React from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Box, Typography } from '@mui/material';
import { Business, Home } from '@mui/icons-material';

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function EstablishmentBreadcrumbs({establishment}) {
    const navigate = useNavigate();
    // Fonction pour remonter dans la hiérarchie
    const getHierarchy = (establishment) => {
        const hierarchy = [];
        while (establishment) {
        hierarchy.unshift(establishment); // Ajoute à l'avant de la liste pour obtenir l'ordre du parent vers l'enfant
        establishment = establishment.establishmentParent;
        }
        return hierarchy;
    };
    const hierarchy = getHierarchy(establishment);
    return (
        <Box role="presentation" onClick={handleClick} sx={{marginY: 3}}>
            <Breadcrumbs aria-label="breadcrumb">
                <Chip
                    href="/online/associations/structures/liste"
                    label="structures"
                    icon={<Business fontSize="small" />}
                    clickable
                    onClick={()=> navigate(`/online/associations/structures/liste/`)}
                />
                {hierarchy.map((parent, index) => (
                    index < hierarchy.length - 1 ? (
                        <Chip
                            label={parent.name}
                            clickable
                            onClick={()=> navigate(`/online/associations/structures/liste/${parent?.id}`)}
                            avatar={
                                    <Avatar
                                        alt={parent?.name}
                                        src={
                                            parent?.logo
                                            ? parent?.logo
                                            : '/default-placeholder.jpg'
                                        }
                                    />
                                }
                        />
                    ) : (
                        <Chip
                            label={parent.name}
                            avatar={
                                    <Avatar
                                        alt={parent?.name}
                                        src={
                                            parent?.logo
                                            ? parent?.logo
                                            : '/default-placeholder.jpg'
                                        }
                                    />
                                }
                        />
                    )
                ))}
            </Breadcrumbs>
        </Box>
        );
}
