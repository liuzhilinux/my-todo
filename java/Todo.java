import java.util.Set;

/**
 * Ｔｏｄｏ 类。
 */
public class Todo {

    /**
     * 文字提示 Tips 。
     */
    private final String NO_CONTENT_ERR = "请填写任务内容。";
    private final String TASK_NO_EXIST_ERR = "任务不存在。";
    private final String NUM_ERR = "清输入合法的任务序号。";
    private final String STEP_ERR = "清输入合法的移动步数。";
    private final String ORIGIN_CONTENT_IS = "原内容是：";
    private final String PLEASE_INPUT_CONTENT = "请输入要修改的内容：";
    private final String YOUR_VERB_IS = "你的动作是： ";
    private final String I_DONT_KNOW_WHAT_YOUR_WANT = "我不知道你想干什么~";
    private final String ARE_YOU_SURE_CLEAR_ALL = "确认清空所有任务吗？[N/y]";

    /**
     * 数据库文件。
     */
    private String dbPath;

    /**
     * 动作。
     */
    private String verb;

    /**
     * 任务序号。
     */
    private int n;

    /**
     * 任务内容。
     */
    private String content;

    /**
     * 移动步数。
     */
    private int n1;

    /**
     * 要修改成的任务内容。
     */
    private String content1;

    /**
     * 主函数。
     * 
     * @param args
     */
    public static void main(String[] args) {
        Todo todo = new Todo();
        todo.init();
    }

    public Todo() {

    }

    private void init() {
        int[] myArr = new int[10];

    }
}