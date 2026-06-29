export default {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        '/',
        '/features/',
        '/pricing/',
        '/newsletter/',
        '/contact/',
        '/demo-booking/',
      ],
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
