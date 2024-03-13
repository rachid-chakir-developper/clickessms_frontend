import React from 'react';
import { CircularProgress, Skeleton } from '@mui/material';
import CardSkeleton from './skeletons/CardSkeleton';
import MediaCardSkeleton from './skeletons/MediaCardSkeleton';
import NotificationSkeleton from './skeletons/NotificationSkeleton';
import SearchResultsSkeleton from './skeletons/SearchResultsSkeleton';
import FormSkeleton from './skeletons/FormSkeleton';
import DashboardSkeleton from './skeletons/DashboardSkeleton';

export default function ProgressService({type}) {
  return (
    <div >{
        (() =>{
            switch (type) {
                case 'circular':
                    return <CircularProgress />;
                    break;
                case 'form':
                    return <FormSkeleton />;
                        break;
                case 'dashboard':
                    return <DashboardSkeleton />;
                        break;
                case 'card':
                    return <CardSkeleton />;
                        break;
                case 'mediaCard':
                    return <MediaCardSkeleton />;
                        break;
                case 'notification':
                    return <NotificationSkeleton />;
                        break;
                case 'searchResults':
                  return <SearchResultsSkeleton />;
                      break;
                // case 'post':
                //     <div>
                //         <Skeleton variant="text" />
                //         <Skeleton variant="circle" width={40} height={40} />
                //         <Skeleton variant="rect" width={210} height={118} />
                //     </div>
                //     break;
              
                default:
                    return <Skeleton variant="text" />;
                    break;
              }
        })()
    }
    </div>
  );
}