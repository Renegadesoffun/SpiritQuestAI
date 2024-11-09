using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class ScoreManager : MonoBehaviour
{
    public static ScoreManager instance;
    public Text scoreText;
    public Text comboText;
    private int score = 0;
    private int combo = 0;
    private float comboTimer = 0f;
    private float comboTimerMax = 5f;
    private int maxCombo = 10;

    void Awake()
    {
        if (instance == null)
        {
            instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
    }

    void Update()
    {
        if (combo > 0)
        {
            comboTimer -= Time.deltaTime;
            if (comboTimer <= 0)
            {
                ResetCombo();
            }
        }
    }

    public void AddScore(int value)
    {
        combo = Mathf.Min(combo + 1, maxCombo);
        comboTimer = comboTimerMax;
        int multiplier = 1 + (combo / 2);
        score += value * multiplier;
        UpdateUI();
        StartCoroutine(ComboEffect());
    }

    public void ResetCombo()
    {
        combo = 0;
        UpdateUI();
    }

    private void UpdateUI()
    {
        scoreText.text = "Score: " + score;
        comboText.text = "Combo: x" + (1 + (combo / 2));
    }

    public IEnumerator ComboEffect()
    {
        comboText.transform.localScale = Vector3.one * 1.5f;
        yield return new WaitForSeconds(0.1f);
        comboText.transform.localScale = Vector3.one;
    }
}
