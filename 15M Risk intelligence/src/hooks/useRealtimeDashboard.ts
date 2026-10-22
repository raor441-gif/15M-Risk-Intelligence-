import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchDashboardMetrics, LiveDashboardMetrics } from '../services/aiAnalystService';

export interface UseRealtimeDashboardReturn {
  metrics: LiveDashboardMetrics | null;
  loading: boolean;
  error: string | null;
  lastUpdatedText: string;
  isLiveSSE: boolean;
  connectionStatus: 'connected' | 'polling' | 'connecting' | 'error';
  refresh: () => Promise<void>;
}

export function useRealtimeDashboard(): UseRealtimeDashboardReturn {
  const [metrics, setMetrics] = useState<LiveDashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedText, setLastUpdatedText] = useState<string>('Syncing...');
  const [isLiveSSE, setIsLiveSSE] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'polling' | 'connecting' | 'error'>('connecting');

  const sseRef = useRef<EventSource | null>(null);
  const pollingTimerRef = useRef<any>(null);
  const lastSyncTimeRef = useRef<number>(Date.now());

  // Format relative timestamp
  const updateRelativeTime = useCallback(() => {
    const deltaSec = Math.floor((Date.now() - lastSyncTimeRef.current) / 1000);
    if (deltaSec < 5) {
      setLastUpdatedText('Just now');
    } else if (deltaSec < 60) {
      setLastUpdatedText(`${deltaSec}s ago`);
    } else {
      const mins = Math.floor(deltaSec / 60);
      setLastUpdatedText(`${mins}m ago`);
    }
  }, []);

  const loadMetricsViaHttp = useCallback(async () => {
    try {
      const data = await fetchDashboardMetrics();
      setMetrics(data);
      lastSyncTimeRef.current = Date.now();
      updateRelativeTime();
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, [updateRelativeTime]);

  // Connect to SSE stream with polling fallback
  useEffect(() => {
    let isMounted = true;

    const connectSSE = () => {
      try {
        if (typeof EventSource === 'undefined') {
          startPollingFallback();
          return;
        }

        const sse = new EventSource('/api/realtime/stream');
        sseRef.current = sse;

        sse.onopen = () => {
          if (!isMounted) return;
          setIsLiveSSE(true);
          setConnectionStatus('connected');
        };

        sse.addEventListener('metrics_update', (event: MessageEvent) => {
          if (!isMounted) return;
          try {
            const parsed = JSON.parse(event.data);
            if (parsed.metrics) {
              setMetrics(parsed.metrics);
              lastSyncTimeRef.current = Date.now();
              updateRelativeTime();
              setLoading(false);
              setError(null);
            }
          } catch (e) {
            console.warn('Error parsing SSE metrics event:', e);
          }
        });

        sse.addEventListener('ping', () => {
          if (!isMounted) return;
          lastSyncTimeRef.current = Date.now();
          updateRelativeTime();
        });

        sse.onerror = () => {
          if (!isMounted) return;
          setIsLiveSSE(false);
          setConnectionStatus('polling');
          sse.close();
          sseRef.current = null;
          startPollingFallback();
        };
      } catch (err) {
        console.warn('SSE initialization failed, falling back to polling:', err);
        startPollingFallback();
      }
    };

    const startPollingFallback = () => {
      if (pollingTimerRef.current) return;
      setConnectionStatus('polling');
      loadMetricsViaHttp();
      // Documented 15-second polling interval
      pollingTimerRef.current = setInterval(() => {
        if (isMounted) {
          loadMetricsViaHttp();
        }
      }, 15000);
    };

    // Initial HTTP fetch to guarantee immediate paint
    loadMetricsViaHttp().then(() => {
      if (isMounted) {
        connectSSE();
      }
    });

    // Timer to keep relative timestamp updated every 5 seconds
    const tickInterval = setInterval(updateRelativeTime, 5000);

    return () => {
      isMounted = false;
      if (sseRef.current) {
        sseRef.current.close();
      }
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
      clearInterval(tickInterval);
    };
  }, [loadMetricsViaHttp, updateRelativeTime]);

  return {
    metrics,
    loading,
    error,
    lastUpdatedText,
    isLiveSSE,
    connectionStatus,
    refresh: loadMetricsViaHttp,
  };
}
