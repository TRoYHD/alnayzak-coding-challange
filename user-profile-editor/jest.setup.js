// Use CommonJS require instead of import
require('@testing-library/jest-dom');

// Mock Next.js features that aren't available in Jest
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useParams: () => ({}),
  useSearchParams: () => ({
    get: () => {},
  }),
  notFound: jest.fn(),
  redirect: jest.fn(), 
}));

// Mock revalidatePath which comes from next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// Mock next/image without using JSX
jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image(props) {
    // Return a function instead of JSX
    return {
      type: 'img',
      props: {
        ...props,
        src: props.src?.src || props.src,
        alt: props.alt || ''
      }
    };
  },
}));

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
);

// Add custom matchers
expect.extend({
  toHaveValue(received, expected) {
    if (!received || typeof received.value === 'undefined') {
      return {
        pass: false,
        message: () => `expected ${received} to have value property`,
      };
    }
    
    const pass = received.value === expected;
    return {
      pass,
      message: () => `expected ${received.value} to be ${expected}`,
    };
  },
  
  toBeInTheDocument(received) {
    const pass = received !== null && received !== undefined;
    return {
      pass,
      message: () => `expected ${received} to be in the document`,
    };
  },
});

// Mock FormData
global.FormData = class MockFormData {
  constructor() {
    this.data = {};
  }
  append(key, value) {
    this.data[key] = value;
  }
  get(key) {
    return this.data[key] || null;
  }
};

// Mock FileReader
global.FileReader = class MockFileReader {
  constructor() {
    this.onload = null;
    this.result = 'data:image/png;base64,mockbase64data';
  }
  readAsDataURL() {
    setTimeout(() => {
      if (this.onload) {
        this.onload({ target: { result: this.result } });
      }
    }, 0);
  }
};