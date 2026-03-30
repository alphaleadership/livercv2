import { MWClient } from '@/api/mw-client';

// Mock fetch
global.fetch = jest.fn() as jest.Mock;

describe('MWClient', () => {
    let client: MWClient;
    const config = { apiUrl: 'https://fr.wikipedia.org/w/api.php' };

    beforeEach(() => {
        client = new MWClient(config);
        (fetch as jest.Mock).mockClear();
    });

    it('should initialize with config', () => {
        expect(client).toBeDefined();
    });

    it('should throw error if apiUrl is missing', () => {
        expect(() => new MWClient({ apiUrl: '' })).toThrow('API URL is required');
    });

    it('should perform GET requests with correct URL and default params', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
        });

        const result = await client.get({ action: 'query', list: 'recentchanges' });

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('action=query'),
            expect.objectContaining({ method: 'GET' })
        );
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('format=json'),
            expect.anything()
        );
        expect(result).toEqual({ success: true });
    });

    it('should handle HTTP errors', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 404,
        });

        await expect(client.get({ action: 'test' })).rejects.toThrow('HTTP error! status: 404');
    });
});
