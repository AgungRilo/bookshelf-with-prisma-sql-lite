'use client';

import React from 'react';
import { Skeleton, Table } from 'antd';
import { useTheme } from "@/context/ThemeContext";

const TableSkeleton = ({ rows = 4, columns = 4 }) => {
  // Generate column skeletons dynamically
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const skeletonColumns = Array.from({ length: columns }).map((_, index) => ({
    title: <Skeleton.Input 
    className={`${isDarkMode ? 'bg-black' : ''} w-full sm:w-32`}
    active={true} 
    size="small" />, // Column Header Skeleton
    dataIndex: `col${index}`,
    key: `col${index}`,
    render: () => <Skeleton className={`${isDarkMode && 'bg-black'}`} title={false} active={true} paragraph={{ rows: 1, width: '100%' }} />, // Cell Skeleton
  }));

  // Generate data skeleton rows dynamically
  const skeletonData = Array.from({ length: rows }).map((_, index) => ({
    key: index,
    ...Object.fromEntries(
      Array.from({ length: columns }).map((_, colIndex) => [`col${colIndex}`, null])
    ),
  }));

  return (
    <Table
      className="w-full"
      columns={skeletonColumns}
      dataSource={skeletonData}
      pagination={false} // Disable pagination for skeleton
      rowKey="key"
    />
  );
};

export default TableSkeleton;

// Usage Example
// In your parent component:
// <TableSkeleton rows={10} columns={5} />
