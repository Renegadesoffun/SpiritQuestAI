using UnityEngine;

public class Collectible : MonoBehaviour
{
    public int scoreValue = 10;

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Player"))
        {
            // Increase the player's score
            ScoreManager.instance.AddScore(scoreValue);

            // Destroy the collectible item
            Destroy(gameObject);
        }
    }
}
