/**
 * Waitlist Controller
 *
 * Handles early user waitlist signups
 */

import { Request, Response } from 'express';
import { query } from '../config/database';

export class WaitlistController {
  /**
   * Add user to waitlist
   * POST /api/waitlist
   */
  static async joinWaitlist(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, referral_source } = req.body;

      // Check if email already exists
      const existingUser = await query(
        'SELECT id FROM waitlist WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        res.status(400).json({ error: 'Email already on waitlist' });
        return;
      }

      // Add to waitlist
      const result = await query(
        `INSERT INTO waitlist (email, name, referral_source)
         VALUES ($1, $2, $3)
         RETURNING id, email, name, created_at`,
        [email, name || null, referral_source || null]
      );

      const waitlistEntry = result.rows[0];

      res.status(201).json({
        message: 'Successfully joined waitlist!',
        waitlist_position: await WaitlistController.getPosition(email),
        entry: {
          id: waitlistEntry.id,
          email: waitlistEntry.email,
          name: waitlistEntry.name,
          created_at: waitlistEntry.created_at,
        },
      });
    } catch (error) {
      console.error('Waitlist signup error:', error);
      res.status(500).json({ error: 'Failed to join waitlist' });
    }
  }

  /**
   * Get waitlist position for an email
   */
  private static async getPosition(email: string): Promise<number> {
    const result = await query(
      `SELECT COUNT(*) as position
       FROM waitlist
       WHERE created_at <= (SELECT created_at FROM waitlist WHERE email = $1)`,
      [email]
    );
    return parseInt(result.rows[0].position);
  }

  /**
   * Get waitlist stats (admin only in production)
   * GET /api/waitlist/stats
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const totalResult = await query('SELECT COUNT(*) as total FROM waitlist');
      const total = parseInt(totalResult.rows[0].total);

      res.json({
        total_signups: total,
      });
    } catch (error) {
      console.error('Waitlist stats error:', error);
      res.status(500).json({ error: 'Failed to get stats' });
    }
  }
}
