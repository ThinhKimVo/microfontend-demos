import { Link } from 'react-router-dom';
import { Card, CardContent, Box, Typography, alpha } from '@mui/material';
import {
  Code,
  BarChart,
  Smartphone,
  Palette,
  TrendingUp,
  Campaign,
  Cloud,
  Security,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { Category } from '../../data/types';

const iconMap: Record<string, React.ElementType> = {
  Code,
  BarChart,
  Smartphone,
  Palette,
  TrendingUp,
  Campaign,
  Cloud,
  Security,
};

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon] || Code;

  return (
    <Card
      component={Link}
      to={`/explore/${category.slug}`}
      sx={{
        textDecoration: 'none',
        display: 'block',
        height: '100%',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: `0px 12px 24px ${alpha(category.color, 0.2)}`,
          borderColor: alpha(category.color, 0.3),
          '& .category-icon': {
            transform: 'scale(1.1)',
          },
          '& .category-arrow': {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
      }}
    >
      <CardContent 
        sx={{ 
          textAlign: 'center', 
          py: { xs: 3, sm: 4 }, 
          px: { xs: 2, sm: 3 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          className="category-icon"
          sx={{
            width: { xs: 56, sm: 72 },
            height: { xs: 56, sm: 72 },
            borderRadius: 3,
            bgcolor: alpha(category.color, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            transition: 'transform 0.3s ease',
          }}
        >
          <IconComponent sx={{ fontSize: { xs: 28, sm: 36 }, color: category.color }} />
        </Box>
        <Typography 
          variant="subtitle1" 
          fontWeight={700} 
          gutterBottom
          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          {category.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            fontWeight={500}
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            {category.courseCount} courses
          </Typography>
          <ArrowIcon 
            className="category-arrow"
            sx={{ 
              fontSize: 16, 
              color: category.color,
              opacity: 0,
              transform: 'translateX(-8px)',
              transition: 'all 0.3s ease',
            }} 
          />
        </Box>
      </CardContent>
    </Card>
  );
}
