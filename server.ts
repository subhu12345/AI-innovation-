import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db.js';
import {
  generateProjectIdeas,
  evaluateProject,
  recommendFeatures,
  generateSystemArchitecture,
  generateRoadmap,
  recommendTechStack
} from './server/gemini.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ==========================================
  // REST API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY')
    });
  });

  // Dashboard Stats
  app.get('/api/dashboard/stats', (req, res) => {
    try {
      const stats = db.getStats();
      res.json({
        success: true,
        message: 'Dashboard statistics retrieved',
        data: stats
      });
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch statistics' });
    }
  });

  // Generate 5 Project Ideas
  app.post('/api/projects/generate', async (req, res) => {
    try {
      const { domain, technologies, difficulty, duration, teamType, projectType, customRequirements } = req.body;

      if (!domain) {
        return res.status(400).json({ success: false, message: 'Domain is required.' });
      }

      const ideas = await generateProjectIdeas({
        domain,
        technologies: Array.isArray(technologies) ? technologies : (technologies ? [technologies] : []),
        difficulty: difficulty || 'Intermediate',
        duration: duration || '1 Month',
        teamType: teamType || 'Individual',
        projectType: projectType || 'Full-Stack Web App',
        customRequirements: customRequirements || ''
      });

      res.json({
        success: true,
        message: 'Successfully generated 5 unique project ideas',
        data: ideas
      });
    } catch (err: any) {
      console.error('Error generating project ideas:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to generate project ideas' });
    }
  });

  // Evaluate a Project
  app.post('/api/projects/evaluate', async (req, res) => {
    try {
      const { title, domain, problemStatement, description, technologiesRequired, targetUsers, projectId } = req.body;

      if (!title || !description) {
        return res.status(400).json({ success: false, message: 'Project title and description are required for evaluation.' });
      }

      const evaluation = await evaluateProject({
        title,
        domain: domain || 'General Technology',
        problemStatement: problemStatement || '',
        description,
        technologiesRequired: Array.isArray(technologiesRequired) ? technologiesRequired : [],
        targetUsers: Array.isArray(targetUsers) ? targetUsers : []
      });

      // If projectId was provided and exists in DB, update it with the evaluation
      if (projectId) {
        db.update(projectId, {
          evaluation,
          readinessScore: evaluation.overallReadinessScore
        });
      }

      res.json({
        success: true,
        message: 'Project evaluated successfully',
        data: evaluation
      });
    } catch (err: any) {
      console.error('Error evaluating project:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to evaluate project' });
    }
  });

  // Recommend Advanced Features
  app.post('/api/projects/recommend-features', async (req, res) => {
    try {
      const { title, domain, description, technologiesRequired, projectId } = req.body;

      if (!title || !description) {
        return res.status(400).json({ success: false, message: 'Project title and description are required.' });
      }

      const features = await recommendFeatures({
        title,
        domain: domain || 'General',
        description,
        technologiesRequired: Array.isArray(technologiesRequired) ? technologiesRequired : []
      });

      if (projectId) {
        db.update(projectId, { recommendedFeatures: features });
      }

      res.json({
        success: true,
        message: 'Recommended features generated successfully',
        data: features
      });
    } catch (err: any) {
      console.error('Error recommending features:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to recommend features' });
    }
  });

  // Generate System Architecture
  app.post('/api/projects/architecture', async (req, res) => {
    try {
      const { title, domain, description, technologiesRequired, projectId } = req.body;

      if (!title || !description) {
        return res.status(400).json({ success: false, message: 'Project title and description are required.' });
      }

      const architecture = await generateSystemArchitecture({
        title,
        domain: domain || 'General',
        description,
        technologiesRequired: Array.isArray(technologiesRequired) ? technologiesRequired : []
      });

      if (projectId) {
        db.update(projectId, { architecture });
      }

      res.json({
        success: true,
        message: 'System architecture generated successfully',
        data: architecture
      });
    } catch (err: any) {
      console.error('Error generating architecture:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to generate architecture' });
    }
  });

  // Generate Development Roadmap
  app.post('/api/projects/roadmap', async (req, res) => {
    try {
      const { title, domain, description, duration, projectId } = req.body;

      if (!title || !description) {
        return res.status(400).json({ success: false, message: 'Project title and description are required.' });
      }

      const roadmap = await generateRoadmap({
        title,
        domain: domain || 'General',
        description,
        duration: duration || '3 Months'
      });

      if (projectId) {
        db.update(projectId, { roadmap });
      }

      res.json({
        success: true,
        message: 'Development roadmap generated successfully',
        data: roadmap
      });
    } catch (err: any) {
      console.error('Error generating roadmap:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to generate roadmap' });
    }
  });

  // Recommend Tech Stack
  app.post('/api/projects/tech-stack', async (req, res) => {
    try {
      const { title, domain, description, constraints } = req.body;

      if (!title || !description) {
        return res.status(400).json({ success: false, message: 'Project title and description are required.' });
      }

      const advice = await recommendTechStack({
        title,
        domain: domain || 'General',
        description,
        constraints
      });

      res.json({
        success: true,
        message: 'Tech stack advice generated successfully',
        data: advice
      });
    } catch (err: any) {
      console.error('Error advising tech stack:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to generate tech stack advice' });
    }
  });

  // Compare Projects
  app.post('/api/projects/compare', (req, res) => {
    try {
      const { projectIds } = req.body;

      if (!Array.isArray(projectIds) || projectIds.length === 0) {
        return res.status(400).json({ success: false, message: 'Array of project IDs is required for comparison.' });
      }

      const projects = projectIds
        .map(id => db.getById(id))
        .filter(Boolean);

      if (projects.length === 0) {
        return res.status(404).json({ success: false, message: 'No valid projects found to compare.' });
      }

      res.json({
        success: true,
        message: 'Projects retrieved for comparison',
        data: projects
      });
    } catch (err: any) {
      console.error('Error comparing projects:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to compare projects' });
    }
  });

  // Get all projects with optional filters
  app.get('/api/projects', (req, res) => {
    try {
      const { domain, difficulty, search, savedOnly } = req.query;
      const projects = db.getAll({
        domain: domain as string,
        difficulty: difficulty as string,
        search: search as string,
        savedOnly: savedOnly === 'true'
      });

      res.json({
        success: true,
        message: `Retrieved ${projects.length} projects`,
        data: projects
      });
    } catch (err: any) {
      console.error('Error listing projects:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to list projects' });
    }
  });

  // Get project by ID
  app.get('/api/projects/:id', (req, res) => {
    try {
      const project = db.getById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      res.json({
        success: true,
        message: 'Project retrieved',
        data: project
      });
    } catch (err: any) {
      console.error('Error getting project:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to get project' });
    }
  });

  // Save / Create new project
  app.post('/api/projects', (req, res) => {
    try {
      const project = db.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Project created and saved successfully',
        data: project
      });
    } catch (err: any) {
      console.error('Error saving project:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to save project' });
    }
  });

  // Update existing project
  app.put('/api/projects/:id', (req, res) => {
    try {
      const updated = db.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: updated
      });
    } catch (err: any) {
      console.error('Error updating project:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to update project' });
    }
  });

  // Delete project
  app.delete('/api/projects/:id', (req, res) => {
    try {
      const deleted = db.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (err: any) {
      console.error('Error deleting project:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to delete project' });
    }
  });

  // ==========================================
  // VITE / STATIC MIDDLEWARE
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Innovation Lab Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
