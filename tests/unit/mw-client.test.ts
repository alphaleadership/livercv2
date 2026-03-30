import { MWClient } from '@/api/mw-client';

// Mock fetch
global.fetch = jest.fn() as jest.Mock;

describe('MWClient', () => {
    let client: MWClient;

    beforeEach(() => {
        // @ts-ignore
        global.mw = undefined;
        client = new MWClient();
        (fetch as jest.Mock).mockClear();
    });

    it('should initialize', () => {
        expect(client).toBeDefined();
    });

    it('should perform GET requests via fetch when mw is not defined', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
        });

        const result = await client.get({ apiUrl: 'https://test.wiki/api.php', action: 'query' });

        expect(fetch).toHaveBeenCalled();
        expect(result).toEqual({ success: true });
    });
});
