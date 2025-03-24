import { logger } from './index';

// Request status enum
export enum RequestStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED',
  FAILED = 'FAILED'
}

// Interface for log request parameters
export interface LogRequestParams {
  userId: string;
  prompt: string;
  model: string;
  provider: string;
  status: string;
  riskScore?: number;
  responseTime?: number;
  riskReason?: string;
  metadata?: Record<string, any>;
}

/**
 * Logs an LLM request with relevant metadata
 * This function can be expanded to store logs in a database
 * @param params Request parameters to log
 */
export const logRequest = async (params: LogRequestParams): Promise<void> => {
  const {
    userId,
    prompt,
    model,
    provider,
    status,
    riskScore = 0,
    responseTime,
    riskReason,
    metadata = {}
  } = params;

  try {
    // Create log entry
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId,
      // Only log the first 100 chars of the prompt for privacy
      promptPreview: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
      promptLength: prompt.length,
      model,
      provider,
      status,
      riskScore,
      ...(responseTime !== undefined && { responseTime }),
      ...(riskReason && { riskReason }),
      ...metadata
    };

    // Log to the console/file via Winston
    if (status === RequestStatus.BLOCKED) {
      logger.warn('Request blocked', { ...logEntry, reason: riskReason });
    } else if (status === RequestStatus.FAILED) {
      logger.error('Request failed', logEntry);
    } else {
      logger.info('LLM request', logEntry);
    }

    // In a production system, you would also store this in a database
    // Example:
    // await db.collection('llm_requests').insertOne(logEntry);
    
    // You might also want to trigger alerts for blocked or high-risk requests
    // if (status === RequestStatus.BLOCKED || riskScore > 80) {
    //   await sendAlert(logEntry);
    // }
  } catch (error) {
    logger.error(`Error logging request: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Retrieve recent request logs
 * This is a placeholder function that would be implemented to query logs from storage
 * @param userId Optional user ID to filter logs
 * @param limit Maximum number of logs to retrieve
 * @param offset Offset for pagination
 * @returns Array of log entries
 */
export const getRequestLogs = async (
  userId?: string,
  limit: number = 100,
  offset: number = 0
): Promise<any[]> => {
  try {
    // In a real implementation, this would query logs from a database
    // Example:
    // const query = userId ? { userId } : {};
    // return await db.collection('llm_requests')
    //   .find(query)
    //   .sort({ timestamp: -1 })
    //   .skip(offset)
    //   .limit(limit)
    //   .toArray();
    
    // For now, just return an empty array
    return [];
  } catch (error) {
    logger.error(`Error retrieving logs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return [];
  }
};

/**
 * Retrieve aggregate statistics for requests
 * This is a placeholder function that would be implemented to generate stats from logs
 * @param timeframe Timeframe for stats (e.g., 'day', 'week', 'month')
 * @param userId Optional user ID to filter stats
 * @returns Aggregated statistics
 */
export const getRequestStats = async (
  timeframe: 'day' | 'week' | 'month' = 'day',
  userId?: string
): Promise<Record<string, any>> => {
  try {
    // In a real implementation, this would aggregate stats from a database
    // Example:
    // const query = userId ? { userId } : {};
    // const startDate = getStartDateForTimeframe(timeframe);
    // query.timestamp = { $gte: startDate };
    // 
    // const stats = await db.collection('llm_requests').aggregate([
    //   { $match: query },
    //   { $group: {
    //     _id: null,
    //     totalRequests: { $sum: 1 },
    //     blockedRequests: { $sum: { $cond: [{ $eq: ['$status', 'BLOCKED'] }, 1, 0] } },
    //     averageRiskScore: { $avg: '$riskScore' },
    //     byProvider: { $push: '$provider' }
    //   }}
    // ]).toArray();
    
    // For now, just return placeholder stats
    return {
      totalRequests: 0,
      blockedRequests: 0,
      averageRiskScore: 0,
      byProvider: {}
    };
  } catch (error) {
    logger.error(`Error retrieving stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      totalRequests: 0,
      blockedRequests: 0,
      averageRiskScore: 0,
      byProvider: {}
    };
  }
}; 