import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import ManualUpload from './ManualUpload';

vi.mock('@/useI18n', () => ({
  default: () => ({
    t: (key) => key,
  }),
}));

const mockDetect = vi.fn();

beforeEach(() => {
  vi.restoreAllMocks();
  window.BarcodeDetector = vi.fn().mockImplementation(() => ({
    detect: mockDetect,
  }));
});

function createMockFile() {
  return new File(['fake-image-content'], 'qr.png', { type: 'image/png' });
}

describe('ManualUpload', () => {
  it('renders the upload area with prompt text', () => {
    render(<ManualUpload onScan={() => {}} />);
    expect(screen.getByText('scan.manual-prompt')).toBeInTheDocument();
  });

  it('renders a hidden file input accepting images', () => {
    render(<ManualUpload onScan={() => {}} />);
    const input = screen.getByTestId('manual-file-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'image/*');
  });

  it('calls onScan with detected barcodes when QR is found', async () => {
    const onScan = vi.fn();
    const barcodes = [{ rawValue: 'otpauth://totp/user?issuer=App&secret=SECRET' }];
    mockDetect.mockResolvedValue(barcodes);

    render(<ManualUpload onScan={onScan} />);
    const input = screen.getByTestId('manual-file-input');
    fireEvent.change(input, { target: { files: [createMockFile()] } });

    await waitFor(() => {
      expect(onScan).toHaveBeenCalledWith(barcodes);
    });
  });

  it('shows loading state while processing the image', async () => {
    mockDetect.mockImplementation(() => new Promise(() => {}));

    render(<ManualUpload onScan={() => {}} />);
    const input = screen.getByTestId('manual-file-input');
    fireEvent.change(input, { target: { files: [createMockFile()] } });

    expect(screen.getByText('scan.manual-loading')).toBeInTheDocument();
  });

  it('shows error when no QR is found in the image', async () => {
    mockDetect.mockResolvedValue([]);

    render(<ManualUpload onScan={() => {}} />);
    const input = screen.getByTestId('manual-file-input');
    fireEvent.change(input, { target: { files: [createMockFile()] } });

    await waitFor(() => {
      expect(screen.getByText('scan.manual-error')).toBeInTheDocument();
    });
  });

  it('clicking the upload zone triggers the file input', () => {
    render(<ManualUpload onScan={() => {}} />);
    const input = screen.getByTestId('manual-file-input');
    const clickSpy = vi.spyOn(input, 'click');
    fireEvent.click(screen.getByTestId('manual-upload-zone'));
    expect(clickSpy).toHaveBeenCalled();
  });

  it('accepts dropped files and calls onScan', async () => {
    const onScan = vi.fn();
    const barcodes = [{ rawValue: 'otpauth://totp/user?issuer=App&secret=SECRET' }];
    mockDetect.mockResolvedValue(barcodes);

    render(<ManualUpload onScan={onScan} />);
    const zone = screen.getByTestId('manual-upload-zone');
    fireEvent.dragOver(zone);
    expect(zone.className).toContain('drag-over');

    const file = createMockFile();
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });

    await waitFor(() => {
      expect(onScan).toHaveBeenCalledWith(barcodes);
    });
  });

  it('resets to idle when a new file is selected after an error', async () => {
    mockDetect.mockResolvedValueOnce([]);
    mockDetect.mockResolvedValueOnce([{ rawValue: 'otpauth://totp/user?issuer=App&secret=SECRET' }]);
    const onScan = vi.fn();

    render(<ManualUpload onScan={onScan} />);
    const input = screen.getByTestId('manual-file-input');

    // First file — error
    fireEvent.change(input, { target: { files: [createMockFile()] } });
    await waitFor(() => {
      expect(screen.getByText('scan.manual-error')).toBeInTheDocument();
    });

    // Second file — success
    fireEvent.change(input, { target: { files: [createMockFile()] } });
    expect(screen.getByText('scan.manual-loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(onScan).toHaveBeenCalledTimes(1);
    });
  });
});
