# MCP Integration Guide

## 🔧 Overview

MindSphere integrates with several Model Context Protocol (MCP) servers to enhance development, testing, and operational capabilities. MCP servers provide standardized interfaces for AI assistants to interact with external tools and services.

## 🛠️ Configured MCP Servers

### 1. Context7 MCP
**Purpose**: Library documentation and code examples
**Configuration**: HTTP-based MCP server
**Use Cases**:
- Fetch up-to-date documentation for libraries
- Get code examples and best practices
- Access comprehensive API references

**Example Usage**:
```typescript
// Fetch LiveKit documentation
const livekitDocs = await context7.getLibraryDocs('/websites/livekit_io', {
  topic: 'voice agents',
  tokens: 5000
});
```

### 2. Supabase MCP Server
**Purpose**: Database operations and management
**Configuration**: HTTP-based MCP server
**Use Cases**:
- Execute SQL queries directly
- Analyze database schema and relationships
- Monitor database performance and usage
- Manage user data and sessions

**Example Usage**:
```typescript
// Query user sessions
const sessions = await supabase.executeSql(`
  SELECT COUNT(*) as total_sessions 
  FROM sessions 
  WHERE user_id = '${userId}'
`);
```

### 3. Chrome DevTools MCP
**Purpose**: Automated testing and debugging
**Configuration**: Local MCP server with Chrome/Chromium
**Use Cases**:
- Automated end-to-end testing
- Performance monitoring and analysis
- Screenshot capture for documentation
- Network request monitoring
- Console log analysis

**Example Usage**:
```typescript
// Take screenshot of meditation page
await chromeDevTools.navigatePage('http://localhost:5173/meditation');
await chromeDevTools.takeScreenshot({ format: 'png', fullPage: true });
```

### 4. Shopify MCP
**Purpose**: E-commerce integration
**Configuration**: NPX-based MCP server
**Use Cases**:
- Product management and catalog operations
- Order processing and customer management
- Inventory tracking and updates
- E-commerce analytics and reporting

## 📁 Configuration Files

### MCP Configuration (`~/.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": [
        "shopify-mcp",
        "--accessToken",
        "YOUR_SHOPIFY_ACCESS_TOKEN",
        "--domain",
        "YOUR_SHOPIFY_DOMAIN"
      ]
    },
    "Context7": {
      "type": "http",
      "url": "https://server.smithery.ai/@upstash/context7-mcp/mcp?api_key=YOUR_API_KEY",
      "headers": {}
    },
    "Supadata: Web ": {
      "type": "http",
      "url": "https://server.smithery.ai/@supadata-ai/mcp/mcp?api_key=YOUR_API_KEY&profile=YOUR_PROFILE",
      "headers": {}
    },
    "Supabase MCP Server": {
      "type": "http",
      "url": "https://server.smithery.ai/@supabase-community/supabase-mcp/mcp?api_key=YOUR_API_KEY&profile=YOUR_PROFILE",
      "headers": {}
    },
    "chrome-devtools": {
      "command": "npx -y chrome-devtools-mcp@latest",
      "env": {},
      "args": []
    }
  }
}
```

## 🚀 Usage Examples

### Database Analysis with Supabase MCP
```typescript
// Get project information
const projects = await supabase.listProjects();
const mindsphereProject = projects.find(p => p.name === 'MindsphereMe');

// Analyze database tables
const tables = await supabase.listTables(mindsphereProject.id);

// Query user data
const userStats = await supabase.executeSql(`
  SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as recent_users
  FROM app_users
`);
```

### Documentation with Context7 MCP
```typescript
// Get React documentation
const reactDocs = await context7.getLibraryDocs('/facebook/react', {
  topic: 'hooks',
  tokens: 3000
});

// Get LiveKit voice agent documentation
const livekitDocs = await context7.getLibraryDocs('/websites/livekit_io', {
  topic: 'voice agents and real-time communication',
  tokens: 5000
});
```

### Testing with Chrome DevTools MCP
```typescript
// Test meditation session flow
await chromeDevTools.navigatePage('http://localhost:5173');
await chromeDevTools.takeScreenshot({ format: 'png' });

// Test voice interface
await chromeDevTools.click({ uid: 'voice-session-button' });
await chromeDevTools.waitFor({ text: 'Voice session started' });

// Monitor network requests
const requests = await chromeDevTools.listNetworkRequests({
  resourceTypes: ['xhr', 'fetch']
});
```

## 🔍 Benefits for MindSphere Development

### 1. Enhanced Development Workflow
- **Real-time Documentation**: Access up-to-date library docs without leaving the editor
- **Database Insights**: Direct database analysis and querying capabilities
- **Automated Testing**: End-to-end testing with Chrome DevTools integration
- **Performance Monitoring**: Real-time performance analysis and optimization

### 2. Quality Assurance
- **Automated Testing**: Chrome DevTools MCP enables comprehensive E2E testing
- **Database Validation**: Supabase MCP allows direct database state verification
- **Documentation Accuracy**: Context7 MCP ensures code examples are current
- **Performance Analysis**: Built-in performance monitoring and optimization

### 3. Operational Excellence
- **Database Management**: Direct database operations and monitoring
- **User Analytics**: Real-time user behavior and usage analysis
- **Error Tracking**: Comprehensive error monitoring and debugging
- **Scalability Planning**: Performance metrics and capacity planning

## 🛠️ Development Best Practices

### Using MCP Servers Effectively
1. **Context-Aware Queries**: Use specific topics and token limits for focused results
2. **Error Handling**: Always handle MCP server errors gracefully
3. **Performance Optimization**: Use appropriate token limits and query filters
4. **Security**: Never expose sensitive credentials in MCP configurations

### Integration Patterns
```typescript
// Example: Comprehensive feature testing
async function testMeditationSession() {
  try {
    // 1. Navigate to meditation page
    await chromeDevTools.navigatePage('http://localhost:5173/meditation');
    
    // 2. Take initial screenshot
    await chromeDevTools.takeScreenshot({ format: 'png' });
    
    // 3. Start meditation session
    await chromeDevTools.click({ uid: 'start-meditation-button' });
    
    // 4. Monitor API calls
    const requests = await chromeDevTools.listNetworkRequests({
      resourceTypes: ['xhr']
    });
    
    // 5. Verify database state
    const sessions = await supabase.executeSql(`
      SELECT COUNT(*) as new_sessions 
      FROM sessions 
      WHERE created_at > NOW() - INTERVAL '1 minute'
    `);
    
    return { success: true, sessions: sessions[0].new_sessions };
  } catch (error) {
    console.error('Test failed:', error);
    return { success: false, error: error.message };
  }
}
```

## 🔐 Security Considerations

### API Key Management
- **Environment Variables**: Store API keys in environment variables
- **Access Control**: Limit MCP server access to necessary operations only
- **Audit Logging**: Monitor MCP server usage and access patterns
- **Regular Rotation**: Rotate API keys regularly for security

### Data Privacy
- **User Data Protection**: Ensure MCP servers don't expose sensitive user data
- **Query Filtering**: Use appropriate filters to limit data access
- **Access Logging**: Log all database queries and operations
- **Compliance**: Ensure MCP usage complies with data protection regulations

## 📊 Monitoring & Analytics

### MCP Server Health
- **Connection Status**: Monitor MCP server connectivity
- **Response Times**: Track MCP server performance
- **Error Rates**: Monitor and alert on MCP server errors
- **Usage Patterns**: Analyze MCP server usage for optimization

### Performance Metrics
- **Query Performance**: Monitor database query execution times
- **Documentation Access**: Track documentation usage patterns
- **Testing Coverage**: Monitor automated test coverage and success rates
- **User Experience**: Track user experience improvements from MCP integration

## 🔮 Future Enhancements

### Planned MCP Integrations
- **GitHub MCP**: Version control and repository management
- **Slack MCP**: Team communication and notifications
- **AWS MCP**: Cloud infrastructure management
- **Analytics MCP**: Advanced user behavior analysis

### Advanced Features
- **MCP Orchestration**: Coordinate multiple MCP servers for complex workflows
- **Custom MCP Servers**: Develop project-specific MCP servers
- **MCP Caching**: Implement intelligent caching for MCP responses
- **MCP Analytics**: Advanced analytics and reporting for MCP usage

---

*Last updated: October 2024*
*MCP Integration Version: v4.0*
